import { getToken } from "./SessionUtil";

export async function AgregarAuto(precio, color, modelo, anio, estado, numSerie, persona) {
    console.log(precio, color, modelo, anio, estado, numSerie, persona);
    const token = getToken();

    const url = `http://localhost:4000/api/admin/autos/guardar`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'TEST-KEY': token,
            },
            body: JSON.stringify({
                precio,
                color,
                modelo,
                anio,
                estado,
                numSerie,
                persona,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error al agregar el auto: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();

        return responseData;
    } catch (error) {
        console.error('Error al agregar el auto:', error);
        throw error;
    }
}
