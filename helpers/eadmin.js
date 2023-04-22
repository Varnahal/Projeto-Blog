module.exports = {
    eadmin:function(req,res,next){
        if(req.isAuthenticated() && req.user.eadmin == 1){
            return next();
        }
        req.flash('error_msg','você precisa ser admin')
        res.redirect('/')
    }
}