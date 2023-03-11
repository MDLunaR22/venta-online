const { Router } = require('express');
const { check } = require('express-validator');

const { existeProductoPorId } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');


const { obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosAgotados,
    obtenerProductosVendidos } = require('../controllers/producto');

const router = Router();


router.get('/mostrar', obtenerProductos);

router.get('/agotados', obtenerProductosAgotados);

router.get('/ventas', obtenerProductosVendidos)

router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProductoPorId);


router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    validarCampos
], crearProducto);


router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], eliminarProducto);

module.exports = router;