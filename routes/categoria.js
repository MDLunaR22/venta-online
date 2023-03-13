const { Router } = require('express');
const { check } = require('express-validator');

const { existeCategoriaPorId, existeCategoria } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

//Controllers
const { obtenerCategorias, obtenerCategoriaPorId, crearCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categoria');

const router = Router();

router.get('/', obtenerCategorias);

router.get('/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],obtenerCategoriaPorId);

router.post('/agregar', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre de la categoria es obligatoria').not().isEmpty(),
    check('nombre').custom( existeCategoria ),
    validarCampos
], crearCategoria);

router.put('/editar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], actualizarCategoria);

router.delete('/eliminar/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], eliminarCategoria);

module.exports = router;