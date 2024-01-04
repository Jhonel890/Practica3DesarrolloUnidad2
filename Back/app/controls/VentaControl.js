'use strict';

var models = require('../models');
var persona = models.persona;
var venta = models.venta;
var auto = models.auto;
var cuenta = models.cuenta;
var rol = models.rol;
var comprador = models.comprador;


class VentaControl {
    async listar(req, res) {
        try {
            const lista = await venta.findAll({
                include: [
                    { model: models.auto, as: "auto", attributes: ['color', 'modelo', 'precio'] },
                    { model: models.comprador, as: "comprador", attributes: ['nombres', 'apellidos'] },
                    { model: models.persona, as: "persona", attributes: ['nombres', 'apellidos'] },
                ],
                attributes: [['external_id', 'External id'], 'fecha', 'total'],
            });

            res.status(200).json({ msg: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al listar ventas:", error);
            res.status(500).json({ msg: "ERROR", tag: "Error al obtener la lista de ventas", code: 500 });
        }
    }

    async obtener(req, res) {
        const externalPersona = req.params.external;

        try {
            const ventas = await venta.findAll({
                where: {
                    '$persona.external_id$': externalPersona,
                },
                include: [
                    {
                        model: models.comprador,
                        as: "comprador",
                        attributes: ['nombres', 'apellidos', 'direccion', 'celular', 'cedula'],
                    },
                    {
                        model: models.auto,
                        as: "auto",
                        attributes: ['modelo', 'color', 'numSerie', 'external_id'],
                    },
                    {
                        model: models.persona,
                        as: "persona",
                        attributes: [],
                    },
                ],
                attributes: [['external_id', 'id'], 'total', 'recargo', 'fecha'],
            });

            res.status(200).json({ msg: "OK", code: 200, datos: ventas });
        } catch (error) {
            console.error("Error al obtener las ventas de la persona:", error);
            res.status(500).json({ msg: "ERROR", tag: "Error al obtener las ventas", code: 500 });
        }
    }

    async guardar(req, res) {
        try {
            const requiredFields = ['fecha', 'nombres', 'apellidos', 'direccion', 'celular', 'cedula', 'auto', 'persona'];
            if (!requiredFields.every(field => req.body.hasOwnProperty(field))) {
                return res.status(400).json({ msg: 'ERROR', tag: 'Faltan datos', code: 400 });
            }

            const uuid = require('uuid');
            const autoA = await auto.findOne({ where: { external_id: req.body.auto } });

            if (!autoA || autoA.estado === "VENDIDO") {
                return res.status(400).json({
                    msg: 'ERROR',
                    tag: 'El auto no existe o ya se ha vendido',
                    code: 400
                });
            }

            const perA = await persona.findOne({ where: { external_id: req.body.persona } });
            const rolA = await rol.findOne({ where: { id: perA.id_rol } });
            console.log("el rol de la persona es", rolA.nombre);
            if (!perA || rolA.nombre !== "vendedor") {
                return res.status(400).json({
                    msg: 'ERROR',
                    tag: 'La persona no existe o no es un vendedor',
                    code: 400
                });
            } else {

                let precioFinal = parseInt(autoA.precio);
                let recargo = true;

                if (autoA.color !== "blanco" && autoA.color !== "plata") {
                    precioFinal += parseInt(autoA.precio) * 0.20;
                } else {
                    recargo = false;
                }

                const data = {
                    total: precioFinal,
                    fecha: req.body.fecha,
                    recargo: recargo,
                    id_auto: autoA.id,
                    id_persona: perA.id,
                    external_id: uuid.v4(),
                    comprador: {
                        nombres: req.body.nombres,
                        apellidos: req.body.apellidos,
                        direccion: req.body.direccion,
                        celular: req.body.celular,
                        cedula: req.body.cedula,
                    },
                };

                const transaction = await models.sequelize.transaction();

                try {
                    const result = await venta.create(data, {
                        include: [{ model: models.comprador, as: 'comprador' }],
                        transaction,
                    });

                    // Actualizar estado del auto a "VENDIDO" si la venta se ha realizado con éxito
                    if (result) {
                        await autoA.update({ estado: "VENDIDO" }, { transaction });
                    }

                    await transaction.commit();

                    if (result) {
                        return res.status(200).json({ msg: 'Venta creada correctamente', code: 200 });
                    } else {
                        return res.status(401).json({ msg: 'ERROR', tag: 'No se puede crear', code: 401 });
                    }
                } catch (error) {
                    console.error('Error al crear la venta:', error);

                    if (transaction) await transaction.rollback();
                    return res.status(500).json({ msg: 'Error interno del servidor', code: 500, error_msg: error.message });
                }
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Error interno del servidor', code: 500, error_msg: error.message });
        }
    }

    async obtenerPersonaPorCorreo(req, res) {
        try {
            const { correo } = req.params;

            if (correo) {
                const cuentaA = await cuenta.findOne({
                    where: { correo: correo },
                    include: [
                        { model: models.persona, as: "persona", attributes: ['nombres', 'external_id'] },
                    ],
                });

                if (!cuentaA) {
                    res.status(404).json({ msg: "ERROR", tag: "Cuenta no encontrada", code: 404 });
                } else if (!cuentaA.persona) {
                    res.status(404).json({ msg: "ERROR", tag: "Persona no encontrada", code: 404 });
                } else {
                    const persona = cuentaA.persona;
                    res.status(200).json({ msg: "OK", tag: "Listo", data: persona, code: 200 });
                }
            } else {
                res.status(400).json({ msg: "ERROR", tag: "Faltan datos", code: 400 });
            }
        } catch (error) {
            console.error('Error en la función obtenerPersonaPorCorreo:', error);
            res.status(500).json({ msg: "ERROR", tag: "Error interno del servidor", code: 500 });
        }
    }

    async modificarVenta(req, res) {
        try {
            const external_id = req.params.external;
            const ventaModificada = req.body;

            // Verificar si la venta con el external_id proporcionado existe
            const ventaExistente = await venta.findOne({
                where: {
                    external_id: external_id
                },
            });

            if (ventaExistente) {

                // Modificar los atributos de la venta existente
                ventaExistente.fecha = ventaModificada.fecha || ventaExistente.fecha;
                ventaExistente.total = ventaModificada.total || ventaExistente.total;
                ventaExistente.recargo = ventaModificada.recargo || ventaExistente.recargo;

                // Guardar los cambios en la base de datos
                await ventaExistente.save();

                res.status(200).json({ msg: "Venta modificada correctamente", code: 200, datos: ventaExistente });
            } else {
                res.status(404).json({ msg: "Venta no encontrada", code: 404 });
            }
        } catch (error) {
            console.error('Error al modificar venta:', error);
            res.status(500).json({ msg: "Error interno del servidor", code: 500, error: error.message });
        }
    }


}

module.exports = VentaControl;