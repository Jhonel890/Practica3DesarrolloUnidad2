'use client'
import React, { useState, useEffect } from 'react';
import Menu from "@/componentes/menu";
import { ListarPersonas } from '@/hooks/listarPersonas';
import { estaSesion, getUser } from '@/hooks/SessionUtil';
import mensajes from '@/componentes/Mensajes';
import { AgregarAuto } from '@/hooks/agregar';


const Agregar = () => {

    if (!estaSesion() || getRol() == "gerente") {
        mensajes("Error de Inicio", "Error", "error");
        window.location.href = '/inicioSesion';
    }

    const [personas, setPersonas] = useState([]);
    const [formData, setFormData] = useState({
        precio: '',
        color: '',
        modelo: '',
        anio: '',
        estado: '',
        numSerie: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Llama a la función para listar personas
                const response = await ListarPersonas();

                if (response && response.datos && Array.isArray(response.datos)) {
                    setPersonas(response.datos);
                } else {
                    console.error('La respuesta de ListarPersonas no tiene la estructura esperada:', response);
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        let external = "";
        console.log(personas);

        try {
            e.preventDefault();
            const { precio, color, modelo, anio, estado, numSerie } = formData;

            if (personas.length > 0) {
                let gerenteEncontrado = false;

                for (const persona of personas) {
                    if (persona.rol.nombre === "gerente") {
                        external = persona.id;  // Suponiendo que 'id' es el campo que necesitas
                        gerenteEncontrado = true;
                        break;  // Salir del bucle una vez que se encuentra el gerente
                    }
                }

                if (!gerenteEncontrado) {
                    console.log("No se encontró a ninguna persona con el rol de gerente");
                }
            } else {
                console.log("No hay personas en la lista");
            }

            const response = await AgregarAuto(precio, color, modelo, anio, estado, numSerie, external);

            if (response && response.code === 200) {
                console.log('Auto creado correctamente:', response);

                mensajes("Auto creado correctamente", "Correcto", "success");
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {

                console.error('Error al crear el auto:', response);

                mensajes("Error al crear el auto", "Hubo un problema al crear el auto", "error");
            }
        } catch (error) {
            mensajes("Error al crear el auto", "Hubo un problema al crear el auto, su numero de serie ya existe", "error");
            console.error('Error al agregar el auto:', error);
        }
    };

    return (
        <div className="container mt-5">
            <header>
                <Menu />
            </header>

            <div>
                <h1 className="mb-4">Agregar Auto</h1>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="precio">Precio:</label>
                        <input
                            type="text"
                            id="precio"
                            name="precio"
                            className="form-control"
                            value={formData.precio}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="color">Color:</label>
                        <input
                            type="text"
                            id="color"
                            name="color"
                            className="form-control"
                            value={formData.color}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="modelo">Modelo:</label>
                        <input
                            type="text"
                            id="modelo"
                            name="modelo"
                            className="form-control"
                            value={formData.modelo}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="anio">Año:</label>
                        <input
                            type="text"
                            id="anio"
                            name="anio"
                            className="form-control"
                            value={formData.anio}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="estado">Estado:</label>
                        <input
                            type="text"
                            id="estado"
                            name="estado"
                            className="form-control"
                            value={formData.estado}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="numSerie">NumSerie:</label>
                        <input
                            type="text"
                            id="numSerie"
                            name="numSerie"
                            className="form-control"
                            value={formData.numSerie}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mt-3">
                        <button type="submit" className="btn btn-primary">Enviar</button>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default Agregar;
