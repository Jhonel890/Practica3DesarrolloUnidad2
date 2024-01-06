'use client'
import React, { useState, useEffect } from 'react';
import { ListarAuto } from "@/hooks/listaAutos";
import Menu from "@/componentes/menu";
import { ModificarAuto } from '@/hooks/modificarAuto';
import { estaSesion } from '@/hooks/SessionUtil';
import mensajes from '@/componentes/Mensajes';

const Modificar = () => {

    if (!estaSesion()) {
        mensajes("Error de Inicio", "Error", "error");
        window.location.href = '/inicioSesion';
    }

    const [autos, setAutos] = useState([]);
    const [selectedNumSerie, setSelectedNumSerie] = useState('');
    const [formData, setFormData] = useState({
        numSerie: '',
        precio: '',
        color: '',
        modelo: '',
        anio: '',
        estado: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ListarAuto();

                if (response && response.datos && Array.isArray(response.datos)) {
                    setAutos(response.datos);
                } else {
                    console.error('La respuesta de ListarAuto no tiene la estructura esperada:', response);
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleNumSerieChange = (e) => {
        const numSerie = e.target.value;
        setSelectedNumSerie(numSerie);

        const selectedAuto = autos.find((auto) => auto.numSerie === numSerie);

        setFormData({
            numSerie: selectedAuto ? selectedAuto.numSerie : '',
            precio: selectedAuto ? selectedAuto.precio : '',
            color: selectedAuto ? selectedAuto.color : '',
            modelo: selectedAuto ? selectedAuto.modelo : '',
            anio: selectedAuto ? selectedAuto.anio : '',
            estado: selectedAuto ? selectedAuto.estado : '',
            external: selectedAuto ? selectedAuto.external : '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        try {
            const external = formData.external;
            const precio = formData.precio;
            const color = formData.color;
            const modelo = formData.modelo;
            const anio = formData.anio;
            const numSerie = formData.numSerie;
            const estado = formData.estado;


            const response = await ModificarAuto(external, precio, color, modelo, anio, numSerie, estado);
            if (response.code == 200) {
                mensajes("Correcto", "Los datos se guardaron", "success");
            }


        } catch (error) {

            console.error('Error al modificar el auto:', error);
        }
    };


    return (
        <div className="container mt-5">
            <header>
                <Menu />
            </header>

            <div>
                <h1 className="mb-4">Modificar Auto</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="numSerie">Número de Serie:</label>
                        <select
                            id="numSerie"
                            name="numSerie"
                            className="form-control"
                            value={selectedNumSerie}
                            onChange={handleNumSerieChange}
                        >
                            <option value="">Selecciona un número de serie</option>
                            {autos.map((auto, index) => (
                                <option key={index} value={auto.numSerie}>
                                    {auto.numSerie}
                                </option>
                            ))}
                        </select>
                    </div>

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
    // } else {
    //     //mensajes("Error al iniciar o sesion perdida", "error");
    //     window.location.href = '/inicioSesion';
    //     }
    // };
}
export default Modificar;
