// MostrarImagen.js

import { useEffect, useState } from 'react';

export default function MostrarImagen({ externalAuto }) {
    const [imagenes, setImagenes] = useState([]);

    useEffect(() => {
        const obtenerImagenes = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/admin/obtener/imagenes/${externalAuto}`);
                const data = await response.json();
                console.log("respuesta de obtener imagenes", response.data);

                if (response.ok) {
                    setImagenes(data.datos.imagenes);
                } else {
                    console.error('Error al obtener las imágenes:', data);
                }
            } catch (error) {
                console.error('Error en la solicitud de imágenes:', error);
            }
        };

        obtenerImagenes();
    }, [externalAuto]); // El efecto se ejecutará cada vez que cambie externalAuto

    return (
        <div className="rounded-container">
            {imagenes.length > 0 ? (
                imagenes.map((imagen, index) => (
                    <img
                        key={index}
                        src={`http://localhost:4000/multimedia/${imagen.archivo}`}
                        alt={`Imagen ${index + 1}`}
                        className="img-thumbnail rounded m-2"
                    />
                ))
            ) : (
                <p>No hay imágenes disponibles</p>
            )}
        </div>
    );

}
