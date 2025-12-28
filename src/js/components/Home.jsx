import React, { useEffect } from "react";
import { useState } from 'react';


const Home = () => {

    const [tareas, setTareas] = useState([]);
    const [inputTemporal, setInputTemporal] = useState('');
    const USER_NAME = "miguel321654987";

    useEffect(() => {

        // GET PARA OBTENER EL USUARIO Y SUS TAREAS
        fetch(`https://playground.4geeks.com/todo/users/${USER_NAME}`)
            .then(response => {
                console.log(response.ok);
                console.log(response.status);
                return response.json();
            })
            .then(data => {
                console.log(data);
                setTareas(data.todos);
            })
            .catch(error => {
                console.error("Error de red/servidor o al crear usuario:", error);
            });
    }, []);


    // HACER POST AL PULSAR ENTER PARA AÑADIR TAREA, Y VACIAR EL IMPUT
    const eventoChange = (event) => {
        setInputTemporal(event.target.value);
    };

    const eventoKeyDown = (event) => {
        if (event.key === 'Enter' && inputTemporal.trim() !== "") {

            fetch(`https://playground.4geeks.com/todo/todos/${USER_NAME}`, {
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
                    setTareas([nuevaTarea, ...tareas]);
                    setInputTemporal('');
                })
                .catch(error => {
                    console.error("Problema detectado:", error);
                });
        }
    };

    // PETICIÓN A LA API PARA ELIMINAR TAREA POR ID CON FILTER, SE BORRA CON BUTTON ONCLICK Y LUEGO SE ACTUALIZA
    const borrarTarea = (todo_id) => {

        fetch(`https://playground.4geeks.com/todo/todos/${todo_id}`, {
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
    };

    // PETICIÓN A LA API PARA ELIMINAR TODAS LAS TAREAS ID CON FILTER, SE BORRA CON BUTTON ONCLICK Y LUEGO SE ACTUALIZA
    const vaciarListaTareas = (todo_id) => {

        fetch(`https://playground.4geeks.com/todo/todos/${todo_id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                console.log(response.ok);
                console.log(response.status);
                setTareas([]);
            })
            .catch(error => {
                console.error("Error de red al intentar borrar:", error);
            });
    };

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
                                <button className="btn btn-warning  border-1 " onClick={vaciarListaTareas}>
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