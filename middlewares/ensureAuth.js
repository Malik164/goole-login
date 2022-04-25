module.exports={

    redirectAuth:function(req,res,next) {
        if (req.isAuthenticated()) {
            res.redirect('/secret')
            return
        }
        next()
        return
    },
    ensureAuth:function(req,res,next) {
        if (!req.isAuthenticated()) {
           req.flash('err_msg','Please Log in First to view resources!') 
           res.redirect('/')
           return
        }
        next()
        return
    }


}