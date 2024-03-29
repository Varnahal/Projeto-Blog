const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const {eadmin}  = require('../helpers/eadmin')



router.get('/', eadmin,(req,res)=>{
    res.render("admin/index")
})

router.get('/posts',(req,res)=>{
    res.send('Pagina de posts')
})

router.get('/categorias', eadmin,(req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        //console.log(categorias[0].nome)
        res.render('admin/categorias',{categorias:categorias}) 
    }).catch((err)=>{
        req.flash("error_msg","Erro ao listar as categorias")
        res.redirect('/admin')
    })
})

router.get('/categorias/add', eadmin,(req,res)=>{
   res.render('admin/addcategorias') 
})

router.post('/categorias/nova', eadmin,(req,res)=>{
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

 router.get('/categorias/edit/:id', eadmin,(req,res)=>{
    Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render('admin/editCategorias',{categoria:categoria})
    })
    .catch((err)=>{
        req.flash('error_msg', 'essa categoria não existe')
        res.redirect('/admin/categorias')
    })
   
 })

 router.post('/categorias/edit', eadmin,(req,res)=>{
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
 router.post('/categorias/deletar', eadmin,(req,res)=>{
    Categoria.findByIdAndRemove(req.body.id).then(()=>{
        req.flash('success_msg',"Deletado com sucesso");
        res.redirect('/admin/categorias');
    })
    .catch((err)=>{
        req.flash('error_msg','houve um erro ao deletar')
        res.redirect('/admin/categorias');
    })
 })

 router.get('/postagens', eadmin,(req,res)=>{

    Postagem.find().lean().populate({path: 'categoria', strictPopulate: false}).sort({data:'desc'}).then((postagens)=>{
        res.render('admin/postagens',{postagens:postagens})
    })
    .catch((err)=>{
        console.log(err)
        req.flash('error_msg','Houve um erro ao listar as postagens')
        res.redirect('/admin')
    })

    
 })
 router.get('/postagens/add', eadmin,(req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render('admin/addpostagem',{categorias:categorias})
    })
    .catch((err)=>{
        req.flash('error_msg','erro ao puxar informacoes de categoria')
        res.redirect('/admin')
    })
    
 })

 router.post('/postagens/nova', eadmin,(req,res)=>{
    var erros=[]

    if(req.body.categoria == "0") {
        erros.push({texto:"Erro, categoria invalida"})
    }

    if(erros.length > 0){
        res.render("admin/addpostagem",{erros:erros})
    }else{
        const novaPostagem = {
            titulo:req.body.titulo,
            descricao:req.body.descricao,
            conteudo:req.body.conteudo,
            categoria:req.body.categoria,
            slug:req.body.slug
        }

        new Postagem(novaPostagem).save().then(()=>{
            req.flash('success_msg','postagem criada com sucesso')
            res.redirect('/admin/postagens')
        })
        .catch((err)=>{
            console.log(err)
            req.flash('error_msg','Houve um erro durante o salvamento da postagem')
            res.redirect('/admin/postagens')
        })
    }
 })

 router.get('/postagens/edit/:id', eadmin,(req,res)=>{

    Postagem.findOne({_id:req.params.id}).lean()
    .then((postagem)=>{

        Categoria.find().lean()
        .then((categorias)=>{
            res.render('admin/editpostagens',{categorias:categorias,postagem:postagem})
        })
        .catch((err)=>{
            req.flash('error_msg','houve um erro ao carregar categorias')
            res.redirect('/admin/postagns')
        })
    })
    .catch((err)=>{
        req.flash('error_msg',"houve um erro ao carregar formulario de edicao")
        res.redirect('/admin/postagens')
    })

    
 })
 router.post('/postagem/edit', eadmin,(req,res)=>{
    console.log('aqui')

    Postagem.findById(req.body.id)
    .then((postagem)=>{
        postagem.titulo=req.body.titulo
        postagem.conteudo=req.body.conteudo
        postagem.descricao=req.body.descricao
        postagem.categoria=req.body.categoria
        postagem.slug=req.body.slug

        postagem.save()
        .then(()=>{
            req.flash('success_msg', 'Salvo com sucesso')
            res.redirect('/admin/postagens')
        })
        .catch((err)=>{
            req.flash('error_msg','Erro ao editar')
            res.redirect('/admin/postagens')
        })
    })
    .catch((err)=>{
        req.flash('error_msg','houve um erro ao realizar a edicao')
        res.redirect('/admin/postagens')
    })



 })

 router.get('/postagens/deletar/:id', eadmin,(req,res)=>{
    Postagem.findOneAndRemove(req.params.id)
    .then(()=>{
        req.flash('success_msg','Postagem apagada com sucesso')
        res.redirect('/admin/postagens')
    })
    .catch((err)=>{
        req.flash('error_msg','Houve um erro ao deletar a mensagem, tente novamente')
        res.redirect('/admin/postagens')
    })
 })




module.exports = router