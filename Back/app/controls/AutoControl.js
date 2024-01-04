'use strict';

var models = require('../models')
const { Sequelize } = require('sequelize');
var persona = models.persona;
var auto = models.auto;

class AutoControl {
    async listar(req, res) {
        try {
            const lista = await auto.findAll({
                include: [
                    { model: models.persona, attributes: ['apellidos', 'nombres'] },
                ],
                attributes: [['external_id', 'external'], 'color', 'modelo', 'precio', 'anio', 'estado', 'numSerie']
            });

            res.status(200).json({ msg: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al listar autos:", error);
            res.status(500).json({ msg: "ERROR", tag: "Error al obtener la lista de autos", code: 500 });
        }
    }

    async listarDisponibles(req, res) {
        try {
            const lista = await auto.findAll({
                include: [
                    {
                        model: models.persona,
                        attributes: ['apellidos', 'nombres'],
                        include: [
                            {
                                model: models.rol,
                                attributes: ['nombre']
                            }
                        ]
                    }
                ],
                attributes: [['external_id', 'id'], 'color', 'modelo', 'precio', 'anio', 'estado', 'numSerie'],
                where: {
                    estado: 'SIN_VENDER'
                }
            });

            res.status(200).json({ msg: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al listar autos:", error);
            res.status(500).json({ msg: "ERROR", tag: "Error al obtener la lista de autos", code: 500 });
        }
    }


    async guardar(req, res) {
        try {
            if (
                req.body.hasOwnProperty('precio') &&
                req.body.hasOwnProperty('color') &&
                req.body.hasOwnProperty('modelo') &&
                req.body.hasOwnProperty('anio') &&
                req.body.hasOwnProperty('numSerie') && // Validar número de serie
                req.body.hasOwnProperty('estado') &&
                req.body.hasOwnProperty('persona')
            ) {
                const uuid = require('uuid');

                // Validar que el número de serie no existe
                const autoExistente = await auto.findOne({
                    where: { numSerie: req.body.numSerie }
                });

                if (autoExistente) {
                    return res.status(400).json({
                        msg: 'ERROR',
                        tag: 'Ya existe un auto con ese número de serie',
                        code: 400
                    });
                }

                const perA = await persona.findOne({
                    where: { external_id: req.body.persona },
                    include: [{ model: models.rol, as: 'rol', attributes: ['nombre'] }],
                });

                if (!perA) {
                    return res.status(401).json({ msg: "ERROR", tag: "No se encuentra la persona", code: 401 });
                }

                const data = {
                    precio: req.body.precio,
                    color: req.body.color,
                    modelo: req.body.modelo,
                    estado: req.body.estado,
                    anio: req.body.anio,
                    numSerie: req.body.numSerie,
                    imagen: {
                        archivo: 'auto.png',
                    },
                    external_id: uuid.v4(),
                    id_persona: perA.id
                };

                console.log(data);

                if (perA.rol.nombre == 'gerente') {
                    const transaction = await models.sequelize.transaction();
                    try {
                        const result = await auto.create(data, {
                            include: [{ model: models.imagen, as: 'imagen' }],
                            transaction,
                        });
                        await transaction.commit();

                        if (result) {
                            return res.status(200).json({ msg: 'Auto creado correctamente', code: 200 });
                        } else {
                            return res.status(401).json({ msg: 'ERROR', tag: 'No se puede crear', code: 401 });
                        }
                    } catch (error) {
                        console.error('Error al crear el auto:', error);

                        if (transaction) await transaction.rollback();
                        return res.status(203).json({ msg: 'No se pudo crear el auto', code: 400, error_msg: error.message });
                    }
                } else {
                    return res.status(400).json({ msg: "ERROR", tag: "La persona que está ingresando no es un gerente" });
                }
            } else {
                return res.status(400).json({ msg: "ERROR", tag: "Datos incorrectos", code: 400 });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "ERROR", tag: "Error interno del servidor", code: 500 });
        }
    }


    async modificar(req, res) {
        try {
            const external = req.params.external;
            const autoModificado = req.body;

            // Verificar si el auto con el external_id proporcionado existe
            const autoExistente = await auto.findOne({
                where: {
                    external_id: external
                }
            });

            if (autoExistente) {
                // Validar que el nuevo número de serie no exista en otro auto
                if (autoModificado.numSerie) {
                    const otroAutoConNumSerie = await auto.findOne({
                        where: {
                            numSerie: autoModificado.numSerie,
                            external_id: { [Sequelize.Op.not]: external } // Excluir el auto actual
                        }
                    });

                    if (otroAutoConNumSerie) {
                        return res.status(400).json({
                            msg: 'ERROR',
                            tag: 'Ya existe un auto con ese número de serie',
                            code: 400
                        });
                    }
                }

                // Validar si la persona es un "gerente" para permitir la modificación
                const personaAsociada = await autoExistente.getPersona();
                const rolPersona = await personaAsociada.getRol();

                if (rolPersona.nombre !== 'gerente') {
                    return res.status(403).json({
                        msg: 'ERROR',
                        tag: 'No tiene permisos para modificar el auto',
                        code: 403
                    });
                }

                // Modificar los atributos del auto existente
                autoExistente.precio = autoModificado.precio || autoExistente.precio;
                autoExistente.color = autoModificado.color || autoExistente.color;
                autoExistente.modelo = autoModificado.modelo || autoExistente.modelo;
                autoExistente.anio = autoModificado.anio || autoExistente.anio;
                autoExistente.numSerie = autoModificado.numSerie || autoExistente.numSerie;
                autoExistente.estado = autoModificado.estado || autoExistente.estado;

                // Guardar los cambios en la base de datos
                await autoExistente.save();

                res.status(200).json({ msg: "OK", code: 200, datos: autoExistente });
            } else {
                res.status(404).json({ msg: "ERROR", tag: "Auto no encontrado", code: 404 });
            }
        } catch (error) {
            console.error('Error al modificar auto:', error);
            res.status(500).json({ msg: "ERROR", tag: "Error interno del servidor", code: 500 });
        }
    }

}

module.exports = AutoControl;



