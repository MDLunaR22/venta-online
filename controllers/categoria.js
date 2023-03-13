const { response, request } = require('express');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto')
const Usuario = require('../models/usuario')
const obtenerCategorias = async (req = request, res = response) => {

    const query = { estado: true };

    const listaCategorias = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
    ]);

    res.json({
        msg: 'Categorias',
        listaCategorias
    });


}

const obtenerCategoriaPorId = async (req = request, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id)

    res.json({
        msg: 'categoria por id',
        categoria
    });

}


const crearCategoria = async (req = request, res = response) => {
    const { nombre } = req.body;

    const existeCategoria = await Categoria.findOne({ nombre: nombre })
    if (existeCategoria) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe en la db`
        })
    }

    const data = {
        nombre: nombre,
        usuario: req.usuario._id
    }

    const categoriaNueva = new Categoria(data);

    await categoriaNueva.save();

    res.status(201).json({
        msg: 'Nueva categoria',
        categoriaNueva
    });

}


const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, req.body, { new: true });

    res.json({
        msg: 'Put de categoria',
        categoria
    });

}


const eliminarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const categoriaDB = await Categoria.findOne({ _id: id });
    const productoEnDB = await Producto.find({ categoria: categoriaDB.categoria, estado: true })
    if (productoEnDB) {
        const productoActualizar = await Producto.findOneAndUpdate({ _id: id }, { categoria: 'Variado' });
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} se modificara a la categoria: variado`
        });
    }

    const categoriaBorrada = await Categoria.findByIdAndDelete(id);

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