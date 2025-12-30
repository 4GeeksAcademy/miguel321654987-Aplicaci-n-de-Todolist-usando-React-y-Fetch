import React, { useEffect } from "react";
import { useState } from 'react';


const Home = () => {

    const [tareas, setTareas] = useState([]);
    const [inputTemporal, setInputTemporal] = useState('');

    const USER_NAME = "miguel321654987";

    //useEffect Ejecuta peticiones solo una vez, justo después del primer renderizado

    useEffect(() => {
        // 1. Intentamos obtener el usuario con GET
        const inicializarUsuario = async () => await fetch(`https://playground.4geeks.com/todo/users/${USER_NAME}`)
            .then(response => {
                console.log(response.ok);
                console.log(response.status);
                return response.json();
            })
            .then(data => {
                setTareas(data.todos);
            })
            .catch(() => {
                // 2. Si el usuario no existe, lo CREAMOS con un POST
                const crearUsuario = async () => await fetch(`https://playground.4geeks.com/todo/users/${USER_NAME}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                })
                    .then(response => {
                        console.log(response.ok);
                        console.log(response.status);
                        return response.json();
                    })
                    .then(data => {
                        setTareas(data.todos);
                    })
                    .catch(error => console.error("Error al crear el usuario:", error));

                crearUsuario()
            });


        inicializarUsuario();
    }, []);


    // HACER POST AL PULSAR ENTER PARA AÑADIR TAREA, Y VACIAR EL IMPUT
    const eventoChange = (event) => {
        setInputTemporal(event.target.value);
    };

    const eventoKeyDown = (event) => {
        if (event.key === 'Enter' && inputTemporal.trim() !== "") {

            const crearTarea = async () => await fetch(`https://playground.4geeks.com/todo/todos/${USER_NAME}`, {
                method: "POST",
                body: JSON.stringify({
                    label: inputTemporal,
                    is_done: false
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    console.log(response.ok);
                    console.log(response.status);
                    return response.json();
                })
                .then(nuevaTarea => {
                    console.log(nuevaTarea);
                    setTareas([...tareas, nuevaTarea]);
                    setInputTemporal('');
                })
                .catch(error => {
                    console.error("Problema detectado:", error);
                });
            crearTarea()
        }
    };

    // PETICIÓN A LA API PARA ELIMINAR TAREA POR ID CON FILTER, SE BORRA CON BUTTON ONCLICK Y LUEGO SE ACTUALIZA

    const borrarTarea = async (todo_id) => await fetch(`https://playground.4geeks.com/todo/todos/${todo_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
        .then(response => {
            console.log(response.ok);
            console.log(response.status);
            const nuevaListaTareas = tareas.filter(tarea => tarea.id !== todo_id);
            setTareas(nuevaListaTareas);
        })
        .catch(error => {
            console.error("Error de red al intentar borrar:", error);
        });


    // ELIMINAR USUARIO, LO QUE ELIMINA TODAS LAS TAREAS EN LUGAR DE IR UNA A UNA. ACTUALIZAR FRONT-END CON setTareas Y REPETIR CREAR USUARIO PARA NUEVAS PETICIONES 

    const vaciarListaTareas = async () => await fetch(`https://playground.4geeks.com/todo/users/${USER_NAME}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
        .then(response => {
            if (response.ok) {
                console.log(response.ok);
                console.log(response.status);
                console.log("Se han eliminado todas las tareas")
                setTareas([]);
                return fetch(`https://playground.4geeks.com/todo/users/${USER_NAME}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                });
            }
        })
        .catch(error => console.error("Error al vaciar la lista:", error)
        );

    // CÓDIGO PARA HTML Y ESTILOS
    return (
        <div className="p-5 m-5 bg-body-secondary">
            <h1 className='text-center mb-5'>LISTA DE TAREAS</h1>
            <div className="border border-blue">
                <ul id="listaDeTareas" className="list-group mb-0 rounded-0">
                    <li className="list-group-item">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="¿Qué necesitas hacer hoy?"
                            value={inputTemporal}
                            onChange={eventoChange}
                            onKeyDown={eventoKeyDown}
                        />
                    </li>
                    {tareas.length > 0 ? (
                        <>
                            {tareas.map((tarea) => (
                                <li key={tarea.id} className="list-group-item d-flex justify-content-between align-items-center elemento-hover">
                                    <p className="m-0">{tarea.label}</p>
                                    <button className="btn btn-danger btn-sm boton-borrar" onClick={() => borrarTarea(tarea.id)}>
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </li>
                            ))}
                            <div className="mt-2 p-1 d-flex justify-content-center">
                                <button className="btn btn-warning  border-1 " onClick={() => vaciarListaTareas()}>
                                    <i className="fa-solid fa-trash-can me-2"></i>
                                    Vaciar toda la lista
                                </button>
                            </div>
                        </>
                    ) : (
                        <li className="list-group-item"><p className="m-0">No hay tareas</p></li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Home;