const { response, request } = require('express');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto')

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

const obtenerCategoriaNombre = async (req = request, res = response) =>{
    // const {categoria} = req.body;
    const categoria = req.params.categoria;
    const categoriaDB = await Categoria.findOne({nombre: categoria})
    if(categoriaDB == null){
        return res.json({
            msg:'La categoria no existe o no se ha colocado el nombre correctamente'
        })
    }

    res.json({
        msg: 'Categoria por nombre',
        categoria: categoriaDB
    })

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
    const categoriaDB = await Categoria.findById( {_id : id} );
    const listaProductos = await Promise.all([
        Producto.countDocuments({categoria: categoriaDB.nombre}),
        producto.find({categoria: categoriaDB.nombre}),
        Producto.updateMany({categoria: categoriaDB.nombre}, {categoria: 'Variado'})
    ])

    const categoriaBorrada = await Categoria.findByIdAndDelete(id);
    return res.json({
        msg: `La categoria ${categoriaDB.nombre} se modificara a la categoria: Variado`,
        listaProductos
    });
}



module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,

    obtenerCategoriaNombre
}