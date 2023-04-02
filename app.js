const express = require('express')
const {engine} = require('express-handlebars')
const bodyParser = require("body-parser")
const app = express()
const path = require('path')
const admin = require('./routes/admin')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

//Configurações
    //sessão
       app.use(session({
        secret:"penis",
        resave:true,
        saveUninitialized:true
       }))
       app.use(flash()) 
    //midddleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            next()
        })
    //body-parser
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

        
        //Exemplo de middleware
            // app.use((req,res,next)=>{
            //     console.log('olá sou um middleware')
            //     next()
            // })
//Rotas
app.use("/admin",admin)

//Outros
const PORT = 3000 || process.env.PORT
app.listen(PORT,()=>{
    console.log('Servidor rodando')
})