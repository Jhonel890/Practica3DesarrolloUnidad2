import mensajes from "@/componentes/Mensajes";
import { useState } from "react";

export default function AgregarFoto({ externalAuto }) {
    const [file, setFile] = useState();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) return;

        const formData = new FormData();
        formData.set("file", file);

        try {
            const response = await fetch(`http://localhost:4000/api/admin/imagenes/guardar/${externalAuto}`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.code === "400") {
                mensajes("El auto ya tiene 3 imágenes", "Error", "error");
            } else {
                mensajes("Imagen añadida", "Correcto", "success");
            }
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            mensajes("Error", "Hubo un problema al subir la imagen", "error");
        }
    };

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="fileInput" className="form-label">Subir archivo:</label>
                    <input type="file" className="form-control" id="fileInput" onChange={handleFileChange} />
                </div>
                <button type="submit" className="btn btn-primary">Subir</button>
            </form>
        </div>
    );
}
