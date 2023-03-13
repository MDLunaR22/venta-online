const { response, request } = require('express');
const Producto = require('../models/producto');

const Categoria = require('../models/categoria')

const obtenerProductos = async (req = request, res = response) => {

    const query = { estado: true }
    const listaProductos = await Promise.all([
        Producto.find(query)
    ]);

    res.json({
        msg: 'Get productos',
        listaProductos
    });
}

const obtenerProductoPorId = async (req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id)

    res.json({
        msg: 'producto por id',
        producto
    });

}

const obtenerProductosAgotados = async (req = request, res = response) => {
    const agotado = { stock: 0 };

    const listaProductos = await Promise.all([
        Producto.countDocuments(agotado),
        Producto.find(agotado)
    ]);

    res.json({
        msg: 'api productos',
        listaProductos
    });
}

const obtenerProductosVendidos = async (req = request, res = response) => {
    let ventas = () => {

    };
    const listaProductos = await Promise.all([
        Producto.countDocuments(ventas),
        Producto.find(ventas)
    ]);
    res.json({
        msg: 'Get productos',
        listaProductos
    });
}


const crearProducto = async (req = request, res = response) => {

    const { nombre, categoria, ...body } = req.body;

    const productoEnDB = await Producto.findOne({ nombre: nombre });
    const existeCategoria = await Categoria.findOne({ nombre: categoria });

    if (productoEnDB) {
        return res.status(400).json({
            msg: `El producto ${productoEnDB.nombre} ya existe en la DB`
        });
    }

    if (!existeCategoria) {
        return res.status(400).json({
            msg: `La categoria ${categoria} no existe en la DB`
        });
    }
    const data = {
        ...body,
        nombre: nombre,
        categoria: categoria,
        usuario: req.usuario._id
    }

    const productoNuevo = new Producto(data);
    await productoNuevo.save();

    res.status(201).json({
        msg: 'Post Producto',
        productoNuevo
    });


}


const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { nombre, categoria, ...body } = req.body;

    const categoriaDB = await Categoria.findOne({ nombre: categoria });

    if (!categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoria} no existe en la db`
        });
    }

    const data = {
        ...body,
        nombre: nombre,
        categoria: categoria
    }

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({
        msg: 'Actualizar producto',
        producto
    });

}


const eliminarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndDelete(id);


    res.json({
        msg: 'delete producto',
        productoBorrado
    });

}



module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,

    obtenerProductosAgotados,
    obtenerProductosVendidos
}