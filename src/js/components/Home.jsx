import React, { useEffect } from "react";
import { useState } from 'react';


const Home = () => {
const [tareas, setTareas] = useState([]);
const [inputTemporal, setInputTemporal] = useState('');
const USER_NAME = "miguel321654987";

useEffect(() => {
    // 1. Intentamos obtener (GET) el usuario y sus tareas
    fetch(`https://playground.4geeks.com/todo/users/${USER_NAME}`)
        .then(resp => {
            if (resp.ok) {
                return resp.json(); // Si existe, pasamos al siguiente .then con los datos
            } else if (resp.status === 404) {
                // 2. Si NO existe, lanzamos un error para capturarlo y crear el usuario
                throw new Error("USUARIO_NO_EXISTE");
            } else {
                throw new Error("ERROR_INESPERADO");
            }
        })
        .then(data => {
            console.log("Usuario existente, cargando tareas:", data.todos);
            setTareas(data.todos || []);
        })
        .catch(error => {
            // 3. Manejamos la creación si el error fue por falta de usuario
            if (error.message === "USUARIO_NO_EXISTE") {
                console.log("Creando usuario nuevo...");
                fetch(`https://playground.4geeks.com/todo/users/${USER_NAME}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                })
                .then(respCrear => {
                    if (respCrear.ok) {
                        console.log("Usuario creado con éxito");
                        setTareas([]); // Iniciamos con lista vacía
                    }
                })
                .catch(err => console.log("Error al crear usuario:", err));
            } else {
                console.log("Error de red o servidor:", error);
            }
        });
}, []);


    const eventoChange = (event) => {
        setInputTemporal(event.target.value);
    };

    // 2. EL POST SE HACE AQUÍ (AL PULSAR ENTER)
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
            if (!response.ok) {
                // Si la respuesta no es 200/201, lanzamos error al .catch
                throw new Error("No se pudo guardar la tarea");
            }
            return response.json(); // Convertimos la respuesta a JSON
        })
        .then(nuevaTarea => {
            // Actualizamos el estado con la tarea que nos devuelve la API (que incluye su ID)
            setTareas([nuevaTarea, ...tareas]);
            // Limpiamos el input
            setInputTemporal('');
        })
        .catch(error => {
            console.error("Problema detectado:", error);
        });
    }
};


   const borrarTarea = (todo_id) => {
    // 1. Petición a la API para borrar por ID
    fetch(`https://playground.4geeks.com/todo/todos/${todo_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (response.ok) {
            // 2. Si el servidor confirma el borrado, actualizamos el estado local
            const nuevasTareasFiltradas = tareas.filter(tarea => tarea.id !== todo_id);
            setTareas(nuevasTareasFiltradas);
            console.log(`Tarea ${todo_id} borrada con éxito`);
        } else {
            // Si la respuesta no es "ok" (ej. error 404 o 400)
            throw new Error("No se pudo borrar la tarea en el servidor");
        }
    })
    .catch(error => {
        // Manejo de errores de red o errores lanzados con throw
        console.error("Error de red al intentar borrar:", error);
    });
};


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
                        tareas.map((tarea) => (
                            <li key={tarea.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <p className="m-0">{tarea.label}</p>
                                <button className="btn btn-danger btn-sm" onClick={() => borrarTarea(tarea.id)}>
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item"><p className="m-0">No hay tareas</p></li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Home;