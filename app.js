const express = require('express')
const {engine} = require('express-handlebars')
const app = express()
const path = require('path')
const admin = require('./routes/admin')

//const mongoose = require('mongoose')

//Configurações
    app.use(express.json())
    //handlebars
    app.engine('handlebars',engine({defaultLayout:'main'}))
    app.set('view engine', 'handlebars')
    //mongoose
        //em breve
    //Public
        app.use(express.static(path.join(__dirname,"public")))
//Rotas
app.use("/admin",admin)

//Outros
const PORT = 3000 || process.env.PORT
app.listen(PORT,()=>{
    console.log('Servidor rodando')
})