const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerFactura, obtenerFacturaPorId, crearFactura, actualizarFactura, eliminarFactura } = require('../controllers/factura');


const { existeProductoPorId, existeFacturaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

//Controllers
const router = Router();

router.get('/', obtenerFactura);

router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerFacturaPorId);

router.post('/agregar/:id', [
    validarJWT,
], crearFactura);

router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeFacturaPorId),
    validarCampos
], actualizarFactura);

router.delete('/eliminar/:id', eliminarFactura);

module.exports = router;
