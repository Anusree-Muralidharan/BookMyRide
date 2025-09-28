const mongoose = require('mongoose');

let sc=mongoose.Schema;
const busSchema = new mongoose.Schema({
    name: { type: String, required: true },
    typeId: { type: mongoose.Schema.Types.ObjectId, ref: 'busTypes', required: true }, // Foreign key
    totalSeats: { type: Number, required: true },
    vehicleNo: { type: String, required: true },
    rc: { type: String, required: true },
    status: {type:String, required :true}
});
var busmodel=mongoose.model("buses",busSchema)
module.exports=busmodel;

