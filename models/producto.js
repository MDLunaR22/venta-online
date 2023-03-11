const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        unique: true
    },
    precioUnidad: {
        type: Number,
        required: true, 
        default: 0
    },
    stock:{
        type: Number,
        requierd: true,
        default: 0
    },
    ventas:{
        type: Number,
        default: 0
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    descripcion: { 
        type: String 
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
});

module.exports = model('Producto', ProductoSchema);