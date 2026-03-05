const Tag = require("../models/Tags")

//Create tag handler function
exports.CreateTag = async (req,res)=>{
    try {
        //fetch data
       const {name,description} = req.body
       
       //if not name or not description
       if(!name || !description){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
       }

       //create entry in db
       const tagDetails = await Tag.create({name:name,description:description})
       console.log(tagDetails)
       //return response

       return res.status(200).json({
        success:true,
        message:"Tag created successfully"
       })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//get Alltags

exports.showAlltags = async (req, res)=>{
    try {

        //all tags
        const allTags = await Tag.find({},{name:true, description:true})
        res.status(200).json({
            success:true,
            message:"All tags returns successfully",
            allTags:allTags
        })
    } catch (error) {
         return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}