import { getToken } from "./SessionUtil";

export async function ModificarAuto(external, precio, color, modelo, anio, numSerie, estado) {
    const token = getToken();

    const url = `http://localhost:4000/api/admin/autos/modificar/${external}`;
    console.log(url);

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'TEST-KEY': token,
            },
            body: JSON.stringify({
                precio,
                color,
                modelo,
                anio,
                numSerie,
                estado,
            }),
        });

        const data = await response.json();

        // Puedes devolver la respuesta si es necesario
        return data;
    } catch (error) {
        console.error('Error al modificar el auto es de modificar:', error);
        // Puedes lanzar el error nuevamente si es necesario
        throw error;
    }
}
