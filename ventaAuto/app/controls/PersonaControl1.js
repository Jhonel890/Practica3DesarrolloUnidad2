'use strict';

var models = require('../models')
var persona = models.persona;
var rol = models.rol;

class PersonaControl {
    async listar(req, res) {
        var lista = await persona.findAll({
            include: [
                { model: models.cuenta, as: "cuenta", attributes: ['correo'] },
                { model: models.rol, as: "rol" },

            ],
            attributes: [['external_id', 'id'], 'apellidos', 'nombres', 'direccion', 'celular',]
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async obtener(req, res) {
        const external = req.params.external;
        var lista = await persona.findOne({
            where: {
                external_id: external
            },
            include: [
                { model: models.cuenta, as: "cuenta", attributes: ['correo', 'clave'] },
                { model: models.rol, as: "rol", attributes: ['nombre'] },

            ],
            attributes: [['external_id', 'id'], 'apellidos', 'nombres', 'direccion', 'celular', 'fecha_nac',]
        });
        if (lista == undefined || lista == null) {
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: {} });

        } else {
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: lista });
        }
    }

    async guardar(req, res) {
        if (
            req.body.hasOwnProperty('nombres') &&
            req.body.hasOwnProperty('apellidos') &&
            req.body.hasOwnProperty('direccion') &&
            req.body.hasOwnProperty('celular') &&
            req.body.hasOwnProperty('rol') &&
            req.body.hasOwnProperty('correo') &&
            req.body.hasOwnProperty('clave')
        ) {
            const uuid = require('uuid');
            const rolA = await rol.findOne({ where: { external_id: req.body.rol } });

            if (rolA != undefined) {
                const data = {
                    nombres: req.body.nombres,
                    apellidos: req.body.apellidos,
                    direccion: req.body.direccion,
                    celular: req.body.celular,
                    id_rol: rolA.id,
                    external_id: uuid.v4(),
                    cuenta: {
                        correo: req.body.correo,
                        clave: req.body.clave,
                    },
                };

                // Si existe un error como un duplicate al momento de crear una cuenta se maneja el transaction
                // para revertir los cambios hechos en persona
                const transaction = await models.sequelize.transaction();
                try {
                    const result = await persona.create(data, {
                        include: [{ model: models.cuenta, as: 'cuenta' }],
                        transaction,
                    });
                    await transaction.commit();

                    if (result == null) {
                        res.status(401).json({ msg: 'ERROR', tag: 'No se puede crear', code: 401 });
                    } else {
                        rolA.external_id = uuid.v4();
                        await rolA.save();
                        res.status(200).json({ msg: 'Ok', code: 200 });
                    }
                } catch (error) {
                    // Aquí se hace el rollback
                    if (transaction) await transaction.rollback();
                    res.status(203).json({ msg: 'NOOO mijo este ya tiene cuentaaa', code: 400, error_msg: error });
                }
            } else {
                res.status(400).json({ msg: 'ERROR', tag: 'El dato a buscar no existe', code: 400 });
            }
        } else {
            res.status(400).json({ msg: 'ERROR', tag: 'Faltan datos', code: 400 });
        }
    }


    async modificar(req, res) {
        try {
            const external = req.params.external;
            const personaModificada = req.body;

            // Verificar si la persona con el external_id proporcionado existe
            const personaExistente = await persona.findOne({
                where: {
                    external_id: external
                }
            });

            if (personaExistente) {
                // Modificar los atributos de la persona existente
                personaExistente.nombres = personaModificada.nombres || personaExistente.nombres;
                personaExistente.apellidos = personaModificada.apellidos || personaExistente.apellidos;
                personaExistente.direccion = personaModificada.direccion || personaExistente.direccion;
                personaExistente.celular = personaModificada.celular || personaExistente.celular;
                personaExistente.fecha_nac = personaModificada.fecha || personaExistente.fecha_nac;

                // Guardar los cambios en la base de datos
                await personaExistente.save();

                res.status(200).json({ msg: "OK", code: 200, datos: personaExistente });
            } else {
                res.status(404).json({ msg: "ERROR", tag: "Persona no encontrada", code: 404 });
            }
        } catch (error) {
            console.error('Error al modificar persona:', error);
            res.status(500).json({ msg: "ERROR", tag: "Error interno del servidor", code: 500 });
        }
    }

    async listarGerentes(req, res) {
        try {
            // Consultar personas con el rol "gerente"
            const gerentes = await persona.findAll({
                include: [
                    {
                        model: models.cuenta,
                        as: "cuenta",
                        attributes: ['correo', 'clave'],
                    },
                    {
                        model: models.rol,
                        as: "rol",
                        where: { nombre: "gerente" }, 
                        attributes: ['nombre'],
                    },
                ],
                attributes: [['external_id', 'id'], 'apellidos', 'nombres', 'direccion', 'celular', 'fecha_nac'],
            });

            // Verificar si se encontraron resultados
            if (gerentes.length === 0) {
                res.status(200).json({ msg: "OK", code: 200, datos: [] });
            } else {
                res.status(200).json({ msg: "OK", code: 200, datos: gerentes });
            }
        } catch (error) {
            console.error('Error en la función listarGerentes:', error);
            res.status(500).json({ msg: "ERROR", tag: " Error interno del servidor", code: 500 });
        }
    }

}

module.exports = PersonaControl;