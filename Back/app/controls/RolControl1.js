'use strict';

var models = require('../models')
var rol = models.rol;

const uuid = require('uuid');
const { Sequelize } = require('sequelize');

class RolControl {
    async listar(req, res) {
        var lista = await rol.findAll({
            attributes: ['nombre', ['external_id', 'id']]
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async guardar(req, res) {
        try {
            if (req.body.hasOwnProperty('nombre') && req.body.nombre) {
                const uuid = require('uuid');
                const nombre = req.body.nombre;

                const rolExistente = await rol.findOne({
                    where: {
                        nombre: {
                            [Sequelize.Op.like]: nombre
                        }
                    }
                });

                if (rolExistente) {
                    res.status(400).json({
                        msg: 'ERROR',
                        tag: 'Ya existe un rol con ese nombre',
                        code: 400
                    });
                    return;
                }

                const data = {
                    nombre: nombre,
                    external_id: uuid.v4()
                };

                const result = await rol.create(data);
                if (result == null) {
                    res.status(401).json({ msg: 'ERROR', tag: 'No se puede crear', code: 401 });
                } else {
                    res.status(200).json({ msg: 'Ok', code: 200 });
                }
            } else {
                res.status(400).json({ msg: 'ERROR', tag: 'Faltan datos o el nombre es inválido', code: 400 });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'ERROR', tag: 'Error interno del servidor', code: 500 });
        }
    }
}

module.exports = RolControl;