const express = require('express')
const handlebars = require('express-handlebars')
const app = express()

//const mongoose = require('mongoose')

//Configurações
    app.use(express.json())
    //handlebars
    app.engine('handlebars',handlebars({defaultLayout:'main'}))
    app.set('view engine', 'handlebars')
    //mongoose
        //em breve

//Rotas

//Outros
const PORT = 3000 || process.env.PORT
app.listen(PORT,()=>{
    console.log('Servidor rodando')
})