import { getToken } from "./SessionUtil";

export async function ModificarVenta(ventaId, fecha, total, recargo) {
    const token = getToken();

    const url = `http://localhost:4000/api/admin/ventas/modificar/${ventaId}`;
    console.log(url);

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'TEST-KEY': token,
            },
            body: JSON.stringify({
                fecha,
                total,
                recargo,
            }),
        });

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error al modificar la venta:', error);

        throw error;
    }
}
