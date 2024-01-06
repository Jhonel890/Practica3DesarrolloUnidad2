'use strict';

var models = require('../models');
var cuenta = models.cuenta;
let jwt = require('jsonwebtoken');

class CuentaControl {
    async inicio_sesion(req, res) {
        if (req.body.hasOwnProperty('correo') &&
            req.body.hasOwnProperty('clave')) {
            const cuentaA = await cuenta.findOne({
                where: { correo: req.body.correo },
                include: [
                    {
                        model: models.persona,
                        as: "persona",
                        attributes: ['apellidos', 'nombres'],
                        include: [{ model: models.rol, as: "rol", attributes: ['nombre'] }]
                    },
                ],
                attributes: ['correo', 'external_id', 'estado', 'clave'],
            });
            if (cuentaA == null) {
                res.status(400);
                res.json({ msg: "ERROR", tag: " Cuenta no existe ", code: 400 });
            } else {
                if (cuentaA.estado == true) {
                    if (cuentaA.clave == req.body.clave) {
                        // todo....
                        const token_data = {
                            external: cuentaA.external_id,
                            check: true
                        };
                        require('dotenv').config();
                        console.log("Valor de KEY_JWT:", process.env.KEY_JWT);
                        const key = process.env.KEY_JWT;
                        const token = jwt.sign(token_data, key, {
                            expiresIn: '2h'
                        });
                        var info = {
                            token: token,
                            user: req.body.correo,
                            rol: cuentaA.persona ? cuentaA.persona.rol.nombre : null  // Agregado para obtener el rol
                        };
                        res.status(200);
                        res.json({ msg: "OK", tag: " Listo ", data: info, code: 200 });
                    } else {
                        res.status(400);
                        res.json({ msg: "ERROR", tag: " Clave incorrecta ", code: 400 });
                    }
                } else {
                    res.status(400);
                    res.json({ msg: "ERROR", tag: " Cuenta desactivada ", code: 400 });
                }
            }
        } else {
            res.status(400);
            res.json({ msg: "ERROR", tag: " Faltan datos", code: 400 });
        }
    }

}

module.exports = CuentaControl;
