const { Schema, model } = require('mongoose');

const facturaSchema = Schema({
    carrito: [{
        idCarrito: {
            type: Schema.Types.ObjectId,
            ref: 'Carrito',
            required: [true, 'El id del carrito es obligatorio']
        },
        productos:[{
            nombre:{
                type: String,
                required: true
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
        }]
    }],
    total: {
        type: Number,
        required: true,
    }
});

module.exports = model('Factura', facturaSchema);