var express = require('express');
var router = express.Router();
const app = express();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

// Rol
const rolC = require('../app/controls/RolControl1');
let rolControl = new rolC();
router.get('/admin/rol', rolControl.listar);
router.post('/admin/rol/save', rolControl.guardar);

// Persona
const personaC = require('../app/controls/PersonaControl1');
let personaControl = new personaC();
router.get('/admin/personas', personaControl.listar);
router.get('/admin/personas/get/:external', personaControl.obtener);
router.get('/admin/personas/get/gerentes', personaControl.listarGerentes);
router.post('/admin/personas/guardar', personaControl.guardar);
router.put('/admin/personas/modificar/:external', personaControl.modificar);

// Auto
const autoA = require('../app/controls/AutoControl');
let autoControl = new autoA();
router.get('/admin/autos', autoControl.listar);
router.get('/admin/autosDisponibles', autoControl.listarDisponibles);
router.post('/admin/autos/guardar', autoControl.guardar);
router.put('/admin/autos/modificar/:external', autoControl.modificar);

// Venta
const ventaA = require('../app/controls/VentaControl');
let ventaControl = new ventaA();
router.get('/admin/ventas', ventaControl.listar);
router.get('/admin/persona/:correo', ventaControl.obtenerPersonaPorCorreo);
router.get('/admin/ventas/:external', ventaControl.obtener);
router.post('/admin/ventas/guardar', ventaControl.guardar);
router.put('/admin/ventas/modificar/:external', ventaControl.modificarVenta);


// Imagen
const imagenA = require('../app/controls/ImagenControl');
let imagenControl = new imagenA();
router.get('/admin/imagenes', imagenControl.listar);
router.get('/admin/obtener/imagenes/:external', imagenControl.obtener);
router.post('/admin/imagenes/guardar/:external', imagenControl.guardarFoto);

// Inicio de sesión
const cuentaControl = require('../app/controls/CuentaControl');
let cuentaControlA = new cuentaControl();
router.post('/login', cuentaControlA.inicio_sesion);

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('wenas wenas');
});

module.exports = router;
