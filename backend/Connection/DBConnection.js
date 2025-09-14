const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Anusree_M:anusree123@cluster0.sjfyle6.mongodb.net/BOOKMYRIDE?retryWrites=true&w=majority&appName=Cluster0'
).then(()=>{console.log("DB Connected")})
.catch(err =>console.log(err))