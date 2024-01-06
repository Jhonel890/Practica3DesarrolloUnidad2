import { getToken } from "./SessionUtil";

export async function ObtenerVenta(usuario) {
    const token = getToken();

    const url = `http://localhost:4000/api/admin/ventas/${usuario}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'TEST-KEY': token,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener el correo de la persona:', error);
        throw error;
    }
}
