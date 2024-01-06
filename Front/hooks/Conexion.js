import mensajes from "@/componentes/Mensajes";

const API_URL = "http://localhost:4000/api/";

export function urlApi() {
  return API_URL;
}

export async function obtener(recurso) {
  const response = await fetch(API_URL + recurso);

  if (!response.ok) {
    throw new Error(`Error en la solicitud GET: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

export async function enviar(recurso, data, key = "") {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (key !== "") {

  }

  const response = await fetch(API_URL + recurso, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    mensajes("Error", "Error al iniciar sesion, usuario o contraseña incorrectos", "success");
  }

  return await response.json();
}
