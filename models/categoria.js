const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la categoria es obligatorio'],
        unique: true
    }, 
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    productos: {
        type: Schema.Types.ObjectId,
        ref: 'Productos'
    }
});

module.exports = model('Categoria', CategoriaSchema);