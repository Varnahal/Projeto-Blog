const express = require('express')
const {engine} = require('express-handlebars')
const bodyParser = require("body-parser")
const app = express()
const path = require('path')
const admin = require('./routes/admin')
const mongoose = require('mongoose')

//Configurações
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
    //handlebars
    app.engine('handlebars',engine({defaultLayout:'main'}))
    app.set('view engine', 'handlebars')
    //mongoose
        mongoose.connect('mongodb+srv://varnahal:chuvachu@varnahal.wu5lufq.mongodb.net/?retryWrites=true&w=majority')
        .then(()=>{
            console.log('conectado a base de dados')
            
        })
        .catch((err)=>{console.log(err)})
    //Public
        app.use(express.static(path.join(__dirname,"public")))
//Rotas
app.use("/admin",admin)

//Outros
const PORT = 3000 || process.env.PORT
app.listen(PORT,()=>{
    console.log('Servidor rodando')
})