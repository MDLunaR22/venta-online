const { response, request } = require('express');
//Modelos
const Factura = require('../models/factura');
const Carrito = require('../models/carrito')



const crearCarrito = async (req = request, res = response) => {

    const body = req.body;
    const { uid } = req.usuario;

    try {
        const carrito = new Carrito({ usuario: uid }, body);
        await carrito.save();
        res.status(201).json({
            msg: 'Carrito:',
            carrito
        });
    } catch (error) {
        res.status(400).json({
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
        const eliminarCarrito = await Carrito.findOneAndDelete({ _id: id });

        if (!eliminarCarrito) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }

        res.status(200).json({ msg: 'Factura eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar la factura', error });
    }
};

module.exports = {
    crearCarrito,
    crearCompra,
    editarCarrito,
    eliminarCarrito
}