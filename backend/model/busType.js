const mongoose = require('mongoose');

let sc=mongoose.Schema;
const busTypeSchema = new sc({
    type:{type:String, required :true},
    status: {type:String, required :true}
});
var busTypemodel=mongoose.model("busTypes",busTypeSchema)
module.exports=busTypemodel;

