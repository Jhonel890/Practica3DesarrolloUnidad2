"use client";
import React, { useState, useEffect } from 'react';
import MenuVendedor from '@/componentes/menuVendedor';
import { ObtenerUsuarioPorCorreo } from '@/hooks/obtenerPorCorreo';
import { ObtenerVenta } from '@/hooks/obtenerVenta';
import { getUser } from '@/hooks/SessionUtil';
import { ModificarVenta } from '@/hooks/modificarVenta';
import mensajes from '@/componentes/Mensajes';

const Modificar = () => {
    const usuario = getUser();
    const [ventas, setVentas] = useState([]);
    const [selectedNumSerie, setSelectedNumSerie] = useState('');
    const [formData, setFormData] = useState({
        fecha: '',
        total: '',
        recargo: '',
        externalVenta: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseCorreo = await ObtenerUsuarioPorCorreo(usuario);
                const externalPersona = responseCorreo.data.external_id;
                const responseVenta = await ObtenerVenta(externalPersona);

                console.log("Ventas de la persona", responseVenta);

                if (responseCorreo && responseVenta) {
                    setVentas(responseVenta.datos);
                } else {
                    console.error('La respuesta no tiene la estructura esperada:', responseCorreo);
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, [usuario]);

    const handleNumSerieChange = (e) => {
        const numSerie = e.target.value;
        setSelectedNumSerie(numSerie);

        const selectedAuto = ventas.find((venta) => venta.auto.numSerie === numSerie);

        setFormData({
            fecha: selectedAuto ? selectedAuto.fecha : '',
            total: selectedAuto ? selectedAuto.total : '',
            recargo: selectedAuto ? selectedAuto.recargo : '',
            externalVenta: selectedAuto ? selectedAuto.id : '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const fecha = formData.fecha;
            const total = formData.total;
            const recargo = formData.recargo;
            const venta = formData.externalVenta;

            console.log(venta, total, recargo);
            const response = await ModificarVenta(venta, fecha, total, recargo);

            console.log('respuesta del put:', response);
            mensajes("Correcto", "Midificación exitosa", "success");
        } catch (error) {
            mensajes("Error", "La modificación falló", "error");
            console.error('Error al modificar el auto:', error);
        }
    };


    return (
        <div className="container mt-4">
            <header>
                <MenuVendedor />
            </header>

            <div>
                <h1 className="mb-4">Modificar Venta</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="numSerie">Venta:</label>
                        <select
                            id="numSerie"
                            name="numSerie"
                            className="form-control"
                            value={selectedNumSerie}
                            onChange={handleNumSerieChange}
                        >
                            <option value="">Selecciona una venta</option>
                            {ventas.map((venta, index) => (
                                <option key={index} value={venta.auto.numSerie}>
                                    | Fech. {venta.fecha} |
                                    | Auto: {venta.auto.modelo} Serie: {venta.auto.numSerie} Color: {venta.auto.color} |
                                    | Comprador. {venta.comprador.nombres} |
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
                        <label htmlFor="total">Total:</label>
                        <input
                            type="total"
                            id="total"
                            name="total"
                            className="form-control"
                            value={formData.total}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="recargo">Recargo:</label>
                        <input
                            type="text"
                            id="recargo"
                            name="recargo"
                            className="form-control"
                            value={formData.recargo}
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

export default Modificar;
