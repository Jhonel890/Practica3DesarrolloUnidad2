'use client'
export default function MenuVendedor() {
    return (
        <nav class="nav">
            <a class="nav-link active" aria-current="page" href="../inicioSesion">Cerrar Sesion</a>
            <a class="nav-link active" aria-current="page" href="../ventas">Ventas</a>
            <a class="nav-link active" aria-current="page" href="../vendedor">Autos disponibles</a>
            <a class="nav-link active" aria-current="page" href="../crearVenta">Crear venta</a>
            <a class="nav-link active" aria-current="page" href="../modificarVenta">Modificar Venta</a>
        </nav>)
}