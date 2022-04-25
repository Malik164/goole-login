const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')
const User = require('../models/User')

module.exports = function () {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
            // find the user first
            try {
                const foundUser = await User.findOne({
                    'gmail_id': profile.id
                })
                // // if no  user found then save it to data-base
                if (!foundUser) {
                    const user = await User.create({
                        fullName: profile.displayName,
                        gmail_id: profile.id,
                        gmail: profile.emails[0].value,
                        pic: profile.photos[0].value
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

