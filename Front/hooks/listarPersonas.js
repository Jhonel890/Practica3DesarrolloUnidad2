import { getToken } from "./SessionUtil";

export async function ListarPersonas() {
    const token = getToken();

    try {
        const response = await fetch('http://localhost:4000/api/admin/personas', {
            headers: {
                'TEST-KEY': token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud GET: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud GET:', error);
        throw error;
    }
}
