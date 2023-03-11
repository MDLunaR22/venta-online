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

    const { estado, usuario, ...body } = req.body;
    const productoEnDB = await Producto.findOne({ nombre: body.nombre });

    const categoriaDB = await Categoria.findOne({ nombre: body.categoria });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe en la DB`
        });
    }
    if (productoEnDB) {
        return res.status(400).json({
            mensajeError: `El producto ${productoEnDB.nombre} ya existe en la DB`
        });
    }
    const data = {
        ...body,
        nombre: body.nombre,
        usuario: req.usuario._id
    }

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json({
        msg: 'Post Producto',
        producto
    });


}


const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;

    const productoEnDB = await Producto.findById({ _id: id });
    const categoriaDB = await Categoria.findOne({ nombre: body.categoria });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe en la DB`
        });
    }
    if (productoEnDB) {
        return res.status(400).json({
            mensajeError: `El producto ${productoEnDB.nombre} ya existe en la DB`
        });
    }

    data.usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({
        msg: 'Put de producto',
        producto
    });

}


const eliminarProducto = async (req = request, res = response) => {

    const { id } = req.params;

    const productoEnDB = await Producto.findOne({ nombre: body.nombre });

    const categoriaDB = await Categoria.findOne({ nombre: body.categoria });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe en la DB`
        });
    }
    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });


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