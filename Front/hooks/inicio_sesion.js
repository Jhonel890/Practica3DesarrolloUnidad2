import { enviar } from "./Conexion";
import { save, saveToken } from "./SessionUtil";

export async function inicioSesion(data) {
    try {
        const sesion = await enviar("login", data);
        if (sesion.code === 200 && sesion.code) {
            console.log(sesion);
            //saveToken(sesion.data.code);
            save("user", sesion.data.user);
            save("external", sesion.data.token);
            save("rol", sesion.data.rol);
        }

        return sesion;
    } catch (error) {
        console.error('Error en la función inicioSesion:', error);
        throw error; // Puedes lanzar el error nuevamente si es necesario
    }
}
