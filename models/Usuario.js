const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        requird:true
    },
    senha:{
        type:String,
        required:true
    }

})

mongoose.model('usuarios',Usuario)