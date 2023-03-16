const { Router } = require('express');
const { check } = require('express-validator');
const { crearCarrito, crearCompra, mostrarCarrito, eliminarCarrito } = require('../controllers/carrito');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esClienteRole } = require('../middlewares/validar-roles');

const router = Router();


router.get('/mostrar', mostrarCarrito)

router.post('/agregarCarrito', [
    validarJWT,
    esClienteRole
], crearCarrito)

router.post('/Comprar', [
    validarJWT,
    validarCampos
], crearCompra);


router.put('/editar/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    validarCampos,
    validarJWT
]);

router.delete('/eliminar/:id',
    validarJWT, eliminarCarrito);

module.exports = router;