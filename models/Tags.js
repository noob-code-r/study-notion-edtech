const mongoose = require("mongoose")


const tagsSchema = new mongoose.Schema({
    name:{
        types:String,
        required: true,
    },
    description:{
        type:String,

    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }
}) 

module.exports = mongoose.model("Tag",tagsSchema)