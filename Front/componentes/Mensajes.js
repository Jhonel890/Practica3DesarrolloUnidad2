import swal from "sweetalert";

const mensajes = (titulo, texto, tipo) =>
  swal(titulo, texto, tipo, {
    button: "Aceptar",
    timer: 5000,
    closeOnEsc: true,
  });

export default mensajes;
