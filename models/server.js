const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            usuario: '/api/usuarios',
            categoria: '/api/categorias',
            producto: '/api/productos'
        }

        this.conectarDB();

        this.middlewares();
        
        this.routes();

    }

    async conectarDB(){
        await dbConection();
    }

    
    middlewares(){
        
        this.app.use( cors() );
        
        this.app.use( express.json() );
        
        this.app.use(  express.static('public') );

    }


    routes(){
        this.app.use( this.paths.auth , require('../routes/auth') );
        this.app.use( this.paths.categoria, require('../routes/categoria'));
        this.app.use( this.paths.producto, require('../routes/producto'));
        this.app.use( this.paths.usuario , require('../routes/usuario') );
    }


    listen(){
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`)
        })
    }


}



module.exports = Server;