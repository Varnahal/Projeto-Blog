const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')

router.get('/',(req,res)=>{
    res.render("admin/index")
})

router.get('/posts',(req,res)=>{
    res.send('Pagina de posts')
})

router.get('/categorias',(req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        //console.log(categorias[0].nome)
        res.render('admin/categorias',{categorias:categorias}) 
    }).catch((err)=>{
        req.flash("error_msg","Erro ao listar as categorias")
        res.redirect('/admin')
    })
})

router.get('/categorias/add',(req,res)=>{
   res.render('admin/addcategorias') 
})

router.post('/categorias/nova',(req,res)=>{
    var erros = [];

    if(!req.body.nome|| typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:"Nome inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:"slug inválido"})
    }
    if(req.body.nome.length <2){
        erros.push({texto:"tamanho de slug inválido, menos que 2 letras"})
    }

    if(erros.length > 0){
        res.render("admin/addcategorias",{erros:erros})
    }

    const novaCategoria = {
        nome:req.body.nome,
        slug:req.body.slug
    }
    new Categoria(novaCategoria).save().then(()=>{
        req.flash("success_msg","Categoria criada com sucesso")
        res.redirect('/admin/categorias')
    })
    .catch((err)=>{
        req.flash("error_msg","erro ao salvar categoria"+ err)
        res.redirect('/admin')
    })
 })

 router.get('/categorias/edit/:id',(req,res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render('admin/editCategorias',{categoria:categoria})
    })
    .catch((err)=>{
        req.flash('error_msg', 'essa categoria não existe')
        res.redirect('/admin/categorias')
    })
   
 })

 router.post('/categorias/edit',(req,res)=>{
    Categoria.findOne({_id:req.body.id})
    .then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save()
        .then(()=>{
            req.flash('success_msg','Categoria editada com sucesso')
            res.redirect('/admin/categorias')
        })
        .catch((err)=>{
            req.flash('error_msg','Erro ao editar categoria')
            res.redirect('/admin/categorias')
        })

    })
    .catch((err)=>{
        req.flash('error_msg',"houve um erro ao editar")
        res.redirect('/admin/categorias')
    })

 })
 router.post('/categorias/deletar',(req,res)=>{
    Categoria.findByIdAndRemove(req.body.id).then(()=>{
        req.flash('success_msg',"Deletado com sucesso");
        res.redirect('/admin/categorias');
    })
    .catch((err)=>{
        req.flash('error_msg','houve um erro ao deletar')
        res.redirect('/admin/categorias');
    })
 })

 router.get('/postagens',(req,res)=>{
    res.render('admin/postagens')
 })
 router.get('/postagens/add',(req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render('admin/addpostagem',{categorias:categorias})
    })
    .catch((err)=>{
        req.flash('error_msg','erro ao puxar informacoes de categoria')
        res.redirect('/admin')
    })
    
 })





module.exports = router