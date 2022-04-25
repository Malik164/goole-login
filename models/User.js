const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    fullName:String,
    fb_name:String,
    fb_id:String,
    gmail_id:String,
    gmail:String,
    pic:String
})

module.exports=mongoose.model('User',userSchema)