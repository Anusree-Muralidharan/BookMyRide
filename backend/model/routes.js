const mongoose = require('mongoose');

let sc=mongoose.Schema;
const routesSchema = new sc({
    sourceLocation:{type:String, required :true},
    destinationLocation: {type:String, required :true},
    distance: { type: Number, required: true },
    status: {type:String, required :true}
});
var routesmodel=mongoose.model("routes",routesSchema)
module.exports=routesmodel;

