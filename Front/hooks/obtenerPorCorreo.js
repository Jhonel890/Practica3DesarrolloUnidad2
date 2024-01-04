import { getToken } from "./SessionUtil";


export async function ObtenerUsuarioPorCorreo(correo) {
    const token = getToken();

    const url = `http://localhost:4000/api/admin/persona/${correo}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'TEST-KEY': token,
            },
        });

        const data = await response.json();

        if (data.code === 200) {
            // const persona = data.data;
            console.log('Persona encontrada:');
        } else if (data.code === 404) {
            console.error('Error:', data.tag);
        } else {
            console.error('Error inesperado:', data.tag);
        }

        // Puedes devolver la respuesta si es necesario
        return data;
    } catch (error) {
        console.error('Error al obtener la persona por correo:', error);
        // Puedes lanzar el error nuevamente si es necesario
        throw error;
    }
}

