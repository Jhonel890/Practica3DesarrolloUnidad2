"use client";
import React, { useEffect, useState } from 'react';
import { ListarAutoDisp } from '@/hooks/listarAutosDisponibles';
import MenuVendedor from '@/componentes/menuVendedor';
import MostrarImagen from '../modificarAuto/imagen';

export default function Page() {
    const [autos, setAutos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ListarAutoDisp();
                console.log(response);

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

    return (

        <div className="container mt-4">
            <header>
                <MenuVendedor></MenuVendedor>
            </header>
            <h1>Lista de Autos</h1>
            {autos.length > 0 ? (

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Modelo</th>
                            <th scope="col">Color</th>
                            <th scope="col">Año</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Num Serie</th>
                            <th scope="col">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {autos.map((auto, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{auto.modelo}</td>
                                <td>{auto.color}</td>
                                <td>{auto.anio}</td>
                                <td>{auto.precio}</td>
                                <td>{auto.numSerie}</td>
                                <td>{auto.estado}</td>
                                <tb><MostrarImagen externalAuto={auto.id} /></tb>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay autos disponibles para vender.</p>
            )}
        </div>
    );
}
