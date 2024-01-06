import mensajes from "@/componentes/Mensajes";
import { enviar } from "./Conexion";
import { save } from "./SessionUtil";

export async function inicioSesion(data) {
    try {
        const sesion = await enviar("login", data);
        if (sesion.code === 200 && sesion.code) {
            console.log(sesion);
            save("user", sesion.data.user);
            save("external", sesion.data.token);
            save("rol", sesion.data.rol);
        }

        return sesion;
    } catch (error) {
        mensajes("Error", "Error al iniciar sesion, usuario o contraseña incorrectos", "success");
        throw error;
    }
}
