const express = require('express')
const {engine} = require('express-handlebars')
const bodyParser = require("body-parser")
const app = express()
const path = require('path')
const admin = require('./routes/admin')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
require('../Projeto-Blog/models/Postagem')
const Postagem = mongoose.model('postagens')
require('../Projeto-Blog/models/Categoria')
const Categoria = mongoose.model('categorias')
const usuarios = require('./routes/usuario')
const passport = require('passport')
require('./config/auth')(passport)

//Configurações
    //sessão
       app.use(session({
        secret:"penis",
        resave:true,
        saveUninitialized:true
       }))
       app.use(passport.initialize())
       app.use(passport.session)
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
app.get('/postagem/:slug',(req,res)=>{
    Postagem.findOne({slug:req.params.slug}).lean()
    .then((postagem)=>{
        if(postagem){
            res.render('postagem/index',{postagem:postagem})
        }else{
            req.flash('error_msg','essa postagem não existe')
            res.redirect('/')
        }
    })
    .catch((err)=>{
        req.flash('error_msg','Houve um erro interno')
        res.redirect('/')
    })
})

app.get('/',(req,res)=>{
    Postagem.find().lean().populate('categoria').sort({data:'desc'})
    .then((postagens)=>{
        res.render('index',{postagens:postagens})
    })
    .catch((err)=>{
        req.flash('error_msg','Houve um erro interno')
        res.redirect('/404')
    })
})

app.get('/categorias',(req,res)=>{
    Categoria.find().lean()
    .then((categorias)=>{
        res.render('categorias/index',{categorias:categorias})
    })
    .catch((err)=>{
        req.flash('error_msg',"Houve um erro ao carregar categorias")
        res.redirect('/')
    })
})

app.get('/categorias/:slug',(req,res)=>{
    Categoria.findOne({slug:req.params.slug}).lean()
    .then((categoria)=>{
        if(categoria){
            Postagem.find({categoria:categoria._id}).lean()
            .then((postagens)=>{
                res.render('categorias/postagens',{postagens:postagens,categoria:categoria})
            })
            .catch((err)=>{
                req.flash('error_msg','houve um erro ao listar os posts')
                res.redirect('/')
            })
        }else{
            req.flash('error_msg','essa categoria não existe')
            res.redirect('/')
        }
    })
    .catch((err)=>{
        req.flash('error_msg',"erro ao encontrar categoria")
        res.redirect('/')
    })
})

app.get('/404',(req,res)=>{
    res.send('Erro 404')
})


app.use("/admin",admin)
app.use('/usuarios',usuarios)

//Outros
const PORT = 3000 || process.env.PORT
app.listen(PORT,()=>{
    console.log('Servidor rodando')
})