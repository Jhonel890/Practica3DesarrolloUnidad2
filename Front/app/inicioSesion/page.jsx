"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import mensajes from "@/componentes/Mensajes";
import { useRouter } from "next/navigation";
import { inicioSesion } from "@/hooks/inicio_sesion";
import { borrarSesion, getRol } from "@/hooks/SessionUtil";

export default function InicioSesion() { // Cambiado a InicioSesion para seguir convenciones de nombres
    borrarSesion();
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        identificador: Yup.string().required('Ingrese su identificador como usuario'),
        clave: Yup.string().required("Ingrese su clave"),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState; // Cambiado a const para desestructuración directa

    const sendData = (data) => {
        const requestData = { correo: data.identificador, clave: data.clave }; // Cambiado a const y corregido el nombre del campo
        inicioSesion(requestData).then((info) => {
            const rol = getRol();
            console.log("el rol de la persona es", rol);
            if (info.code === 200) {
                mensajes("Inicio Exitoso", "Bienvenido", "success");
                if (rol == "vendedor") {
                    router.push("/vendedor");

                } else {
                    router.push("/gerente");
                }
            } else {
                mensajes("Error de Inicio", info.msg, "error");
            }
        });
    };

    return (
        <div className="container">
            <div
                className="px-4 py-5 px-md-5 text-center text-lg-start"
                style={{ backgroundColor: "hsl(0, 0%, 96%)" }}
            >
                <div className="container">
                    <div className="row gx-lg-5 align-items-center">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <h1 className="my-5 display-3 fw-bold ls-tight">
                                Inicio <br />
                                <span className="text-primary">Sesión</span>
                            </h1>
                        </div>

                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <div className="card">
                                <div className="card-body py-5 px-md-5">
                                    <form onSubmit={handleSubmit(sendData)}>
                                        <div className="form-outline mb-4">
                                            <input
                                                {...register("identificador")}
                                                type="text"
                                                name="identificador"
                                                id="identificador"
                                                className={`form-control ${errors.identificador ? "is-invalid" : ""
                                                    }`}
                                            />
                                            <label className="form-label">Identificador Usuario</label>
                                            <div className="alert alert-danger invalid-feedback">
                                                {errors.identificador?.message}
                                            </div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input
                                                {...register("clave")}
                                                type="password"
                                                name="clave"
                                                id="clave"
                                                className={`form-control ${errors.clave ? "is-invalid" : ""
                                                    }`}
                                            />
                                            <label className="form-label">Clave</label>
                                            <div className="alert alert-danger invalid-feedback">
                                                {errors.clave?.message}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block mb-4"
                                        >
                                            Iniciar Sesión {/* Cambiado a español */}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

