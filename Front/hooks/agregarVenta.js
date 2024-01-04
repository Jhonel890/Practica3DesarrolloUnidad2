import { getToken } from "./SessionUtil";

export async function AgregarVenta(fecha, nombres, apellidos, direccion, celular, cedula, auto, persona) {
    console.log("datos a enviar", fecha, nombres, apellidos, direccion, celular, cedula, auto, persona);
    const token = getToken();

    const url = `http://localhost:4000/api/admin/ventas/guardar`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'TEST-KEY': token,
            },
            body: JSON.stringify({
                fecha, nombres, apellidos, direccion, celular, cedula, auto, persona
            }),
        });

        if (!response.ok) {
            throw new Error(`Error al agregar el auto: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();

        // Puedes devolver la respuesta si es necesario
        return responseData;
    } catch (error) {
        console.error('Error al agregar el auto:', error);
        // Puedes lanzar el error nuevamente si es necesario
        throw error;
    }
}
