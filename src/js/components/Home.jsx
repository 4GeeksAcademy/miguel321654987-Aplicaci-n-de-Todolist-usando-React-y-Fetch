import React, { useEffect } from "react";
import { useState } from 'react';

const USER_NAME = "miguel321654987";

const Home = () => {
    const [tareas, setTareas] = useState([]);
    const [inputTemporal, setInputTemporal] = useState('');

    // 1. EL USEEFFECT SOLO PARA CARGAR (GET)
    useEffect(() => {
        const cargarTareas = async () => {
            try {
                const response = await fetch(`https://playground.4geeks.com/todo/users/${USER_NAME}`);
                if (response.ok) {
                    const data = await response.json();
                    setTareas(data.todos); // Cargamos lo que ya existe en la API
                }
            } catch (error) {
                console.error("Error cargando tareas:", error);
            }
        };
        cargarTareas();
    }, []);

    const eventoChange = (event) => {
        setInputTemporal(event.target.value);
    };

    // 2. EL POST SE HACE AQUÍ (AL PULSAR ENTER)
    const eventoKeyDown = async (event) => {
        if (event.key === 'Enter' && inputTemporal.trim() !== "") {
            
            // Creamos el objeto que la API espera
            const nuevaTareaApi = {
                label: inputTemporal,
                is_done: false
            };

            try {
                const response = await fetch(`https://playground.4geeks.com/todo/todos/${USER_NAME}`, {
                    method: "POST",
                    body: JSON.stringify(nuevaTareaApi),
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) throw new Error("Error al guardar la tarea");

                const tareaCreada = await response.json();

                // Actualizamos el estado con la tarea que devuelve la API (que ya tiene ID real)
                setTareas([...tareas, tareaCreada]);
                setInputTemporal('');

            } catch (error) {
                console.error("Problema detectado:", error);
            }
        }
    };

  const borrarTarea = async (todo_id) => {
    try {
        // 1. Petición a la API para borrar por ID
        const response = await fetch(`https://playground.4geeks.com/todo/todos/${todo_id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            // 2. Si el servidor confirma el borrado (status 204 o 200), 
            // actualizamos el estado local para que desaparezca de la vista
            const nuevasTareasFiltradas = tareas.filter(tarea => tarea.id !== todo_id);
            setTareas(nuevasTareasFiltradas);
            console.log(`Tarea ${todo_id} borrada con éxito`);
        } else {
            console.error("No se pudo borrar la tarea en el servidor");
        }
    } catch (error) {
        console.error("Error de red al intentar borrar:", error);
    }

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