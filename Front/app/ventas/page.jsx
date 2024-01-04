"use client";
// Importa los componentes necesarios
import React, { useEffect, useState } from 'react';
import { estaSesion, getUser } from '@/hooks/SessionUtil';
import mensajes from '@/componentes/Mensajes';
import MenuVendedor from '@/componentes/menuVendedor';
import { ObtenerUsuarioPorCorreo } from '@/hooks/obtenerPorCorreo';
import { ObtenerVenta } from '@/hooks/obtenerVenta';

export default function Page() {
    const usuario = getUser();
    console.log("el usuario es ", usuario);
    const [ventas, setVentas] = useState(null);
    const [numeroSerie, setNumeroSerie] = useState(''); // Número de serie para filtrar

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseCorreo = await ObtenerUsuarioPorCorreo(usuario);
                const externalPersona = responseCorreo.data.external_id;
                const responseVenta = await ObtenerVenta(externalPersona); // Obtén todos los datos de ventas

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

    // Función para manejar cambios en el número de serie
    const handleNumeroSerieChange = (e) => {
        setNumeroSerie(e.target.value);
    };

    // Función para realizar la búsqueda localmente en los datos existentes
    const buscarVentaPorNumeroSerie = () => {
        if (numeroSerie && ventas && ventas.length > 0) {
            const ventasEncontradas = ventas.filter(venta => venta.auto.numSerie.includes(numeroSerie));

            if (ventasEncontradas.length > 0) {
                return ventasEncontradas;
            }
        }

        return null;
    };

    // Función para clasificar las ventas por mes
    const clasificarVentasPorMes = () => {
        const ventasPorMes = {};

        if (ventas && ventas.length > 0) {
            ventas.forEach((venta) => {
                const mes = new Date(venta.fecha).getMonth(); // Obtener el mes (0-11)
                const nombreMes = obtenerNombreMes(mes);

                if (!ventasPorMes[nombreMes]) {
                    ventasPorMes[nombreMes] = [];
                }

                ventasPorMes[nombreMes].push(venta);
            });
        }

        return ventasPorMes;
    };

    // Función para obtener el nombre del mes
    const obtenerNombreMes = (mes) => {
        const nombresMeses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        return nombresMeses[mes];
    };

    // Función para renderizar la tabla de ventas por mes
    const renderVentaPorMes = () => {
        const ventasFiltradas = buscarVentaPorNumeroSerie();
        const ventasPorMes = clasificarVentasPorMes();

        if (ventasFiltradas && ventasFiltradas.length > 0) {
            return (
                <div className="my-4">
                    {/* Mostrar datos de la venta filtrados por número de serie */}
                    <h5 className="mb-3">Ventas Filtradas por Número de Serie</h5>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Modelo Auto</th>
                                <th>Color Auto</th>
                                <th>Nombres Comprador</th>
                                <th>Total</th>
                                <th>Fecha</th>
                                <th>NumSerie</th>
                                <th>Recargo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventasFiltradas.map((venta) => (
                                <tr key={venta.id}>
                                    <td>{venta.auto.modelo}</td>
                                    <td>{venta.auto.color}</td>
                                    <td>{venta.comprador.nombres}</td>
                                    <td>{venta.total}</td>
                                    <td>{venta.fecha}</td>
                                    <td>{venta.auto.numSerie}</td>
                                    <td>{venta.recargo ? 'Sí' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        } else if (ventasPorMes && Object.keys(ventasPorMes).length > 0) {
            return (
                <div className="my-4">
                    {/* Mostrar ventas clasificadas por mes */}
                    <h5 className="mb-3">Ventas Clasificadas por Mes</h5>
                    {Object.entries(ventasPorMes).map(([mes, ventas]) => (
                        <div key={mes} className="mb-4">
                            <h6>{mes}</h6>
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Modelo Auto</th>
                                        <th>Color Auto</th>
                                        <th>Nombres Comprador</th>
                                        <th>Total</th>
                                        <th>Fecha</th>
                                        <th>Numero serie</th>
                                        <th>Recargo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ventas.map((venta) => (
                                        <tr key={venta.id}>
                                            <td>{venta.auto.modelo}</td>
                                            <td>{venta.auto.color}</td>
                                            <td>{venta.comprador.nombres}</td>
                                            <td>{venta.total}</td>
                                            <td>{venta.fecha}</td>
                                            <td>{venta.auto.numSerie}</td>
                                            <td>{venta.recargo ? 'Sí' : 'No'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            );
        } else {
            return <p className="mt-3">No hay ventas disponibles</p>;
        }
    };

    // Resto de tu código JSX aquí, incluyendo el buscador y la llamada a renderVentaPorMes()
    return (
        <div>
            <div className="container mt-4">
                <header>
                    <MenuVendedor></MenuVendedor>
                </header>
                {/* Buscador por número de serie */}
                <div className="mb-3">
                    <label className="me-2">Buscar por Número de Serie:</label>
                    <input type="text" className="form-control" value={numeroSerie} onChange={handleNumeroSerieChange} />
                </div>

                {/* ... Otros elementos de la página ... */}
                {renderVentaPorMes()}
            </div>
        </div>
    );
}
