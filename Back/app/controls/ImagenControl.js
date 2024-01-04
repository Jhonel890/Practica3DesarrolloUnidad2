'use strict';

var models = require('../models')
var formidable = require('formidable')
var fs = require('fs');
const path = require('path');

var persona = models.persona;
var imagen = models.imagen;
var auto = models.auto;
const { Sequelize } = require('sequelize');



class ImagenControl {
    async listar(req, res) {
        try {
            const lista = await imagen.findAll({

                attributes: [['external_id', 'External id'], 'archivo',]
            });

            res.status(200).json({ msg: "OK", code: 200, datos: lista });
        } catch (error) {
            console.error("Error al listar autos:", error);
            res.status(500).json({ msg: "ERROR", tag: "Error al obtener la lista de autos", code: 500 });
        }
    }

    async obtener(req, res) {
        try {
            const externalAuto = req.params.external;

            const lista = await auto.findOne({
                where: { external_id: externalAuto },
                include: [
                    { model: models.imagen, as: "imagen", attributes: ['archivo'] },
                ],
                attributes: ['modelo', 'color'],
            });

            if (!lista) {
                res.status(200).json({ msg: "OK", code: 200, datos: {} });
            } else {
                const imagenes = lista.imagen.map(img => {
                    const imagenArchivo = img.archivo;
                    const rutaImagen = path.join('public', 'multimedia', imagenArchivo);

                    // Verificar si el archivo de la imagen existe
                    if (fs.existsSync(rutaImagen)) {
                        // Aquí puedes realizar operaciones con la imagen, como obtener atributos, procesarla, etc.
                        // Por ahora, solo devolvemos la información básica.
                        return { ...img.toJSON(), rutaImagen };
                    } else {
                        return null;
                    }
                });

                res.status(200).json({ msg: "OK", code: 200, datos: { ...lista.toJSON(), imagenes } });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: "ERROR", code: 500 });
        }
    }






    async guardarFoto(req, res) {
        const external = req.params.external;
        const autoA = await auto.findOne({
            where: { external_id: external },
            include: [{ model: imagen, as: 'imagen' }]
        });

        if (!autoA) {
            res.status(404).json({ msg: 'Auto no encontrado', code: 404 });
            return;
        }

        // Elimina las imágenes con nombre "auto.png" o "NONE"
        await imagen.destroy({
            where: {
                id_auto: autoA.id,
                archivo: { [Sequelize.Op.or]: ['auto.png', 'NONE'] }
            }
        });

        // Verifica si ya hay 3 imágenes asociadas al auto
        if (autoA.imagen && autoA.imagen.length >= 3) {
            res.status(400).json({
                msg: "ERROR",
                tag: "No se pueden agregar más de 3 imágenes al auto",
                code: 400
            });
            return;
        } else {

            var form = new formidable.IncomingForm(), files = [];
            form.on('file', function (field, file) {
                files.push(file);
            }).on('end', async function () {
                console.log('OK');

                const maxSize = 2 * 1024 * 1024;
                const allowedFormats = ['jpg', 'png'];

                for (let index = 0; index < files.length; index++) {
                    var file = files[index];
                    var extension = file.originalFilename.split('.').pop().toLowerCase();

                    if (file.size > maxSize || !allowedFormats.includes(extension)) {
                        res.status(400).json({
                            msg: "ERROR",
                            tag: "Formato o tamaño de archivo no válido",
                            code: 400
                        });
                        return;
                    } else {
                        const name = external + '_' + index + '.' + extension;
                        console.log(extension);
                        var data = {
                            archivo: name
                        };

                        // Verifica si la imagen actual es "auto.png" o "NONE"
                        if (autoA.imagen && autoA.imagen.some(img => img.archivo === "auto.png" || img.archivo === "NONE")) {
                            // Reemplaza la imagen existente
                            await autoA.imagen[0].update(data); // Actualiza solo la primera imagen, ajusta si es necesario
                        } else {
                            // Crea una nueva imagen
                            await autoA.createImagen(data);
                        }

                        fs.rename(file.filepath, 'public/multimedia/' + name, function (err) {
                            if (err) {
                                res.status(500).json({
                                    msg: "ERROR",
                                    tag: "No se pudo guardar el archivo",
                                    code: 500
                                });
                                return;
                            }
                        });
                    }
                }

                res.status(200).json({ msg: "OK", code: 200 });
            });


            form.parse(req);
        }
    }



}

module.exports = ImagenControl;



