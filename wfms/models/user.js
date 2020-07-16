const mongoose = require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
    username:{type:String,unique:true},
    password:String,
    ename:String,
    email:String,
    desgn:String,
    contact:Number,
    desc:String
    });

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
