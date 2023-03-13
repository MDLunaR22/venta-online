const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');


const Role = require('../models/role')


const getUsuarios = async (req = request, res = response) => {
    
    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'GET API de usuarios',
        listaUsuarios
    });

}

const postUsuario = async (req = request, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;
    const usuarioDB = new Usuario({ nombre, correo, password, rol });
    
    const salt = bcryptjs.genSaltSync();
    usuarioDB.password = bcryptjs.hashSync(password, salt);
    
    await usuarioDB.save();

    const token = await generarJWT( usuarioDB.id );

    res.status(201).json({
        msg: 'POST API de usuario',
        usuarioDB,
        token
    });

}

const putUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    const usuario1 = req.header('x-token');
    const { _id, rol, estado, ...resto } = req.body;

    const rolUsuario = await Usuario.findById({_id: usuario1.uid})
    const usuario = await Usuario.findOne({_id: id})

    if(rolUsuario.rol != 'ADMIN_ROLE'){
        return res.status(501).json({
            msg: 'Un cliente no puede hacer esto'
        })
    }
    if(usuario.rol == 'ADMIN_ROLE'){
        return res.status(400).json({
            msg:'No se puede editar un admin'
        })
    }
    
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(resto.password, salt);
    
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT API de usuario',
        usuarioEditado
    });

}


const deleteUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);
    

    res.json({
        msg: 'DELETE API de usuario',
        usuarioEliminado
    });

}



module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario
}