const { response, request } = require('express');
const Producto = require('../models/producto');

const Categoria = require('../models/categoria')

const obtenerProductos = async (req = request, res = response) => {

    const query = { estado: true }
    const listaProductos = await Promise.all([
        Producto.find(query)
    ]);

    res.json({
        msg: 'Productos',
        listaProductos
    });
}

const obtenerProductoPorId = async (req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id)

    res.json({
        msg: 'Producto por id',
        producto
    });

}

const obtenerProductosNombre = async (req = request, res = response) => {
    const { producto } = req.params;
    const productoDB = await Producto.findOne({ nombre: producto })

    if (productoDB == null) {
        return res.status(400).json({
            msg: 'El producto no existe o no se coloco el nombre del producto correctamente'
        })
    }

    res.json({
        msg: 'Producto por nombre',
        productoDB
    });
}

const obtenerProductosAgotados = async (req = request, res = response) => {
    const agotado = { stock: 0 };

    const listaProductos = await Promise.all([
        Producto.countDocuments(agotado),
        Producto.find(agotado)
    ]);

    res.json({
        msg: 'Productos agotados',
        listaProductos
    });
}

const obtenerProductosVendidos = async (req = request, res = response) => {

    const listaProductos = await Promise.all([
        Producto.find({ ventas: { $gt: 1 } })
    ]);
    return res.json({
        msg: 'Productos mas vendidos',
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
        msg: 'Agregar Producto',
        productoNuevo
    });


}


const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const actualizar = req.body;

    const categoriaDB = await Categoria.findOne({ nombre: actualizar.categoria });

    if (!categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${actualizar.categoria} no existe en la db`
        });
    }

    const producto = await Producto.findByIdAndUpdate(id, actualizar);

    res.json({
        msg: 'Actualizar producto',
        producto
    });

}


const eliminarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndDelete(id);


    res.json({
        msg: 'Eliminar producto',
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
    obtenerProductosVendidos,
    obtenerProductosNombre
}