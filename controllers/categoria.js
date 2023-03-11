const { response, request } = require('express');
const Categoria = require('../models/categoria');

const obtenerCategorias = async(req = request, res = response) => {
    
     const query = { estado: true };

     const listaCategorias = await Promise.all([
         Categoria.countDocuments(query)
     ]);
 
     res.json({
         msg: 'GET API de usuarios',
        listaCategorias
     });


}

const obtenerCategoriaPorId = async(req = request, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById( id )

    res.json({
        msg: 'categoria por id',
        categoria
    });

}


const crearCategoria = async (req = request, res = response) => {

    const nombre  = req.body.nombre;
    
    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe en la DB`
        });
    }
    
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    
    await categoria.save();

    res.status(201).json({
        msg: 'Post de categoria',
        categoria
    });

}


const actualizarCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;

    const categoriaDB = await Categoria.findOne({ nombre: data.nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe en la DB`
        });
    }
    
    data.nombre = data.nombre;
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        msg: 'Put de categoria',
        categoria
    });

}


const eliminarCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        msg: 'delete categoria',
        categoriaBorrada
    });

}



module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}