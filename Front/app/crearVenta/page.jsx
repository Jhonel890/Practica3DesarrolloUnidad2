'use client'
import React, { useState, useEffect } from 'react';
import { ListarAutoDisp } from '@/hooks/listarAutosDisponibles';
import { estaSesion, getUser } from '@/hooks/SessionUtil';
import mensajes from '@/componentes/Mensajes';
import { ObtenerUsuarioPorCorreo } from '@/hooks/obtenerPorCorreo';
import MenuVendedor from '@/componentes/menuVendedor';
import { AgregarVenta } from '@/hooks/agregarVenta';

const Crearventa = () => {
    const usuario = getUser();

    if (!estaSesion()) {
        mensajes("Error de Inicio", "Error", "error");
        window.location.href = '/inicioSesion';
    }

    const [autos, setAutos] = useState([]);
    const [selectedNumSerie, setSelectedNumSerie] = useState('');
    const [formData, setFormData] = useState({
        fecha: '',
        nombres: '',
        apellidos: '',
        direccion: '',
        celular: '',
        cedula: '',
        external: '', // Agregué external al estado para almacenar el valor seleccionado del auto
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ListarAutoDisp();

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
            ...formData,
            external: selectedAuto ? selectedAuto.id : '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        try {
            const { fecha, nombres, apellidos, direccion, celular, cedula, external } = formData;
            const responseCorreo = await ObtenerUsuarioPorCorreo(usuario);
            const externalPersona = responseCorreo.data.external_id;

            console.log(fecha, nombres, apellidos, direccion, celular, cedula, external, externalPersona);

            const responseVenta = await AgregarVenta(
                fecha,
                nombres,
                apellidos,
                direccion,
                celular,
                cedula,
                external,
                externalPersona
            );
            console.log("Ventas de la persona", responseVenta);

            if (responseCorreo && responseVenta) {
                mensajes("Venta creada correctamente", "Correcto", "success"); // Corregido a 'success'
            } else {
                console.error('La respuesta no tiene la estructura esperada:', responseCorreo);
            }
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    return (
        <div className="container mt-4">
            <header>
                <MenuVendedor />
            </header>
            <div>
                <h1 className="mb-2">Guardar Venta</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="numSerie">Auto:</label>
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
                                    | N°s.{auto.numSerie} |
                                    Col. {auto.color} |
                                    Mod. {auto.modelo} |
                                    $. {auto.precio} |
                                    Año. {auto.anio} |
                                    <span>
                                        Col. {auto.color} |
                                        {auto.color !== 'plata' && auto.color !== 'blanco' ? (
                                            <h1> Este auto contiene recargo</h1>
                                        ) : (
                                            <h1> Este auto no contiene recargo</h1>
                                        )}
                                    </span>

                                </option>

                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fecha">Fecha:</label>
                        <input
                            type="text"
                            id="fecha"
                            name="fecha"
                            className="form-control"
                            value={formData.fecha}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombres">Nombres:</label>
                        <input
                            type="text"
                            id="nombres"
                            name="nombres"
                            className="form-control"
                            value={formData.nombres}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellidos">Apellidos:</label>
                        <input
                            type="text"
                            id="apellidos"
                            name="apellidos"
                            className="form-control"
                            value={formData.apellidos}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="direccion">Direccion:</label>
                        <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            className="form-control"
                            value={formData.direccion}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="celular">Celular:</label>
                        <input
                            type="text"
                            id="celular"
                            name="celular"
                            className="form-control"
                            value={formData.celular}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cedula">Cédula:</label>
                        <input
                            type="text"
                            id="cedula"
                            name="cedula"
                            className="form-control"
                            value={formData.cedula}
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
};

export default Crearventa;

