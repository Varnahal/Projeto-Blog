const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/registro',(req,res)=>{
    res.render('usuarios/registros')
})
router.post('/registro',(req,res)=>{
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:'nome invalido'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto:'Email invalido'})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto:'Senha invalido'})
    }
    if(req.body.senha.length < 4){
        erros.push({texto:'Senha Muito curta'})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto:'as senhas são diferentes'})
    }

    if(erros.length > 0){
        res.render("usuarios/registros",{erros:erros})
    }else{
        
        Usuario.findOne({email:req.body.email})
        .then((usuario)=>{
            if(usuario){
                req.flash('error_msg','Email já cadastrado')
                res.redirect('/usuarios/registro')
            }else{

                const novoUsuario = new Usuario({
                    nome:req.body.nome,
                    email:req.body.email,
                    senha:req.body.senha
                })


                bcrypt.genSalt(10,(erro,salt)=>{
                    bcrypt.hash(novoUsuario.senha,salt,(err,hash)=>{
                        if(err){
                            req.flash('error_msg','houve um erro ao salvar o usuario')
                            res.redirect('/')
                        }

                        novoUsuario.senha = hash
                        novoUsuario.save().then(()=>{
                            req.flash('success_msg','usuario criado com sucesso')
                            res.redirect('/')
                        })
                        .catch((err)=>{
                            req.flash('error_msg','Houve um erro ao criar usuario ,tente novamente')
                            res.redirect('usuarios/registro')

                        })
                    })
                })

            }
        })
        .catch((err)=>{
            req.flash('error_msg','Houve um erro interno')
            res.redirect('/')
        })
    }
})

router.get('/login',(req,res)=>{
    res.render('usuarios/login')

})
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/usuarios/login',
        failureFlash:true
    })(req,res,next)
})


router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        req.flash('success_msg','deslogado com sucesso')
        res.redirect('/')
      })
    
})

module.exports  = router