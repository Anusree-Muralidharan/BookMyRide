const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    name: { type: String, required: true },
    typeId: { type: mongoose.Schema.Types.ObjectId, ref: 'busTypes', required: true },
    totalSeats: { type: Number, required: true },
    vehicleNo: { type: String, required: true },
    rc: { type: String, required: true },
    status: { type: String, required: true },
    image: { type: String, default: null }
});

var busmodel = mongoose.model("buses", busSchema);
module.exports = busmodel;
