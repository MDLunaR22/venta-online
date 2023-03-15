const { Schema, model } = require('mongoose');

const carritoSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El id del usuario es obligatorio']
    },
    productos: [{
        nombre: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio']
        },
        cantidad: {
            type: Number,
            required: [true, 'La cantidad del producto es obligatoria'],
            default: 1
        },
        precio: {
            type: Number,
            required: [true, 'El precio del producto es obligatorio']
        }
    }],
    total: {
        type: Number,
        required: true
    }
});

module.exports = model('Carrito', carritoSchema);