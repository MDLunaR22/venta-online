const { response, request } = require('express');
//Modelos
const Factura = require('../models/factura');
const Carrito = require('../models/carrito')
const Producto = require('../models/producto')

const mostrarCarrito = async (req = request, res = response) => {
    const listaCarrito = await Promise.all([
        Carrito.find()
    ])

    res.json({
        msg: 'lista de carritos',
        listaCarrito
    })
}

const crearCarrito = async (req = request, res = response) => {

    const { producto, cantidad } = req.body;
    const id = req.usuario._id;

    const productoDB = await Producto.findOne({ nombre: producto })
    let stockDB = productoDB.stock;
    let precioUnidad = productoDB.precioUnidad;

    let total = 0;

    if (stockDB < cantidad) {
        return res.status(500).json({
            msg: 'No se puede agregar mas de este producto'
        })
    }
    total += (cantidad * precioUnidad)

    const productos = {
        nombre: producto,
        cantidad: cantidad,
        precio: precioUnidad
    }

    const data = {
        usuario: id,
        productos: productos,
        total: total
    }
    try {
        const carrito = new Carrito(data);
        await carrito.save();
        let stock = productoDB.stock - cantidad
        const actualizarProducto = await Producto.findOneAndUpdate({ nombre: producto }, { stock: stock, ventas: cantidad })
        res.status(201).json({
            msg: 'Carrito:',
            carrito
        });
    } catch (error) {
        res.status(400).json({
            id,
            msg: 'Error al crear el carrito',
            error
        });
    }
};


const crearCompra = async (req = request, res = response) => {

    const usuario = req.usuario;

    try {
        const carrito = await Carrito.findById(usuario.uid).populate('productos.producto');

        let total = 0;
        for (const item of carrito.productos) {
            total += item.producto.precio * item.cantidad;
        }

        const factura = new Factura({
            usuario: carrito.usuario,
            productos: carrito.productos,
            total: total
        });
        await factura.save();

        res.status(201).json({
            msg: 'factura:',
            factura
        });
    } catch (error) {
        res.status(400).json({
            error
        });
    }
};


const editarCarrito = async (req, res) => {
    const { id } = req.params;
    const producto = req.body;

    try {
        const actualizarCarrito = await Carrito.findOneAndUpdate(
            { _id: id },
            { producto },
            { new: true }
        );

        res.status(200).json({
            msg: 'factura actualizada:',
            actualizarCarrito: actualizarCarrito
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error al actualizar la factura',
            error
        });
    }
};

const eliminarCarrito = async (req, res) => {
    const { id } = req.params;
  
    try {
      const carritoEliminado = await Carrito.findOneAndDelete({ _id: id });
  
      if (!carritoEliminado) {
        return res.status(404).json({ message: 'Factura no encontrada' });
      }
  
      res.status(200).json({ message: 'Factura eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la factura' });
    }
  };

module.exports = {
    crearCarrito,
    crearCompra,
    editarCarrito,
    eliminarCarrito,
    mostrarCarrito
}