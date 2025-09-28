const mongoose = require('mongoose');

let sc=mongoose.Schema;
const loginSchema = new sc({
    name:String,
    email:String,
    password:String,
    mobile: String,
    role: { type: String, default: 'User' },
    status: {type:String, required :true}
});
var loginmodel=mongoose.model("users",loginSchema)
module.exports=loginmodel;

