const passport=require('passport')
const FacebookStrategy=require('passport-facebook').Strategy

module.exports=function() {
    passport.use(new FacebookStrategy({
        clientID:process.env.FACEBOOK_CLIENT_ID,
        clientSecret:process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL:'/auth/facebook/callback'
    },
    async function (accessToken, refreshToken, profile, cb) {
        try {
            const foundUser = await User.findOne({
                'fb_id': profile.id
            })
            // // if no  user found then save it to data-base
            if (!foundUser) {
                const user = await User.create({
                    fullName: profile.displayName,
                    fb_id:profile.id
                })
                done(null,user)
                return
            }
            return done(null,foundUser)
        } catch (error) {
            return done(error,false)
        }
        
    }
    ))
      // serialize 
      passport.serializeUser((user,done)=>{
        done(null,user.id)
    })

    //de serialzie user
    passport.deserializeUser(async (id,done)=>{
        let user=await User.findById(id)
        done(null,user)
    })
}