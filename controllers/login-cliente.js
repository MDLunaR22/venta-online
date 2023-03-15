const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const register = async (req = request, res = response) => {
    const { nombre, correo, password } = req.body;
    const usuarioDB = new Usuario({ nombre, correo, password, rol: 'CLIENTE_ROLE' });

    const salt = bcryptjs.genSaltSync();
    usuarioDB.password = bcryptjs.hashSync(password, salt);
    
    await usuarioDB.save();

    const token = await generarJWT( usuarioDB.id );

    res.status(201).json({
        msg: 'Registrar usuario con rol CLIENTE',
        usuarioDB,
        token
    });
}

module.exports = {
    register
}
