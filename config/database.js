const mongoose = require("mongoose")
require("dotenv").config()

exports.connectDb = ()=>{
    mongoose.connect(process.env.DB_URL)
    .then(()=>console.log("Connected to DB"))
    .catch((e)=>{console.log("Failed to Connect DB",e)})
    process.exit(1)
}

