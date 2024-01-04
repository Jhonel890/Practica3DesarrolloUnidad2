"use client"
import React, { useEffect, useState } from 'react';
import { ListarAuto } from "@/hooks/listaAutos";
import Menu from '@/componentes/menu';
import { estaSesion } from '@/hooks/SessionUtil';
import mensajes from '@/componentes/Mensajes';
import MostrarImagen from '../modificarAuto/imagen';
import AgregarFoto from '../agregar/agregarFoto'; // Asegúrate de poner la ruta correcta

const Page = () => {
    const [autos, setAutos] = useState([]);
    const [mostrarAgregarFoto, setMostrarAgregarFoto] = useState(false);
    const [externalAutoSeleccionado, setExternalAutoSeleccionado] = useState(null); // Nuevo estado

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ListarAuto();

                if (response && response.datos && Array.isArray(response.datos)) {
                    setAutos(response.datos);
                    console.log(response.datos);
                } else {
                    console.error('La respuesta de ListarAuto no tiene la estructura esperada:', response);
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleButtonClick = (auto) => {
        // Mostrar información del auto en la consola
        console.log('Información del auto:', auto);

        // Almacenar el external del auto seleccionado
        setExternalAutoSeleccionado(auto.external);

        // Mostrar el componente AgregarFoto al hacer clic en el botón
        setMostrarAgregarFoto(true);
    };

    return (
        <div>
            <p></p>
            <header>
                <Menu></Menu>
            </header>
            <div className="container mt-5">
                <h1>Lista de Autos</h1>
                {mostrarAgregarFoto && <AgregarFoto externalAuto={externalAutoSeleccionado} />}

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
                            <th scope="col">Imágenes</th>
                            <th scope="col">Acciones</th>
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
                                <td>
                                    <MostrarImagen externalAuto={auto.external
                                    } />
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => handleButtonClick(auto)}
                                    >
                                        Añadir Imagen
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
}

export default Page;
