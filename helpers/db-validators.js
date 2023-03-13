const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Role = require('../models/role');
const Producto = require('../models/producto');

const emailExiste = async( correo = '' ) => {
    
    const existeEmailDeUsuario = await Usuario.findOne( { correo } );
    if ( existeEmailDeUsuario) {
        throw new Error(`El correo ${ correo }, ya esta registrado en la DB `);
    }
}

const esRoleValido = async( rol = '') => {
    
    const existeRolDB = await Role.findOne( { rol } );
    if ( !existeRolDB ) {
        throw new Error(`El rol ${ rol }, no existe en la DB `);
    }
}

const validarRol = async (id) => {
    const usuario = await Usuario.findOne({_id: id})
    const {rol} = await Role.finOne({rol: usuario.rol})

    if(!existeRol){
        throw new Error(`El rol ${usuario.rol} no existe en la db`)
    }

    if(rol == 'ADMIN_ROLE' && rol == 'CLIENTE_ROLE'){
        throw new Error(`El rol no puede hacer esto`)
    }

}

const existeUsuario = async () => {
    const existIdOfUser = await Usuario.findById( id );
    if ( !existIdOfUser ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }
}


const existeUsuarioPorId = async( id ) => {
    
    const existIdOfUser = await Usuario.findById( id );
    if ( !existIdOfUser ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}

const existeCategoriaPorId = async( id ) => {
    
    const existIdOfCategory = await Categoria.findById( id );
    if ( !existIdOfCategory ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}

const existeCategoria = async( nombre ) => {
    
    const existeCategoria = Categoria.findOne({ nombre: nombre });
    if ( !existeCategoria ) {
        throw new Error(`La categoria: ${existeCategoria} no existe en la DB`);
    }

}


const existeProductoPorId = async( id ) => {
    
    const existIdOfProduct = await Producto.findById( id );
    if ( !existIdOfProduct ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}


module.exports = {
    emailExiste,
    esRoleValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,

    validarRol,
    existeCategoria
}