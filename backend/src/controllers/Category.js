const Category = require("../models/Category")
const Course = require("../models/Course")

//Create category handler function
exports.createCategory = async (req,res)=>{
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
       const categoryDetails = await Category.create({name:name,description:description})
       console.log(categoryDetails)
       //return response

       return res.status(200).json({
        success:true,
        message:"Category created successfully"
       })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//get AllCategorys

exports.showAllCategory = async (req, res)=>{
    try {

        //all Categorys
        const allCategorys = await Category.find({},{name:true, description:true})
        res.status(200).json({
            success:true,
            message:"All categorys returns successfully",
            allCategorys:allCategorys
        })
    } catch (error) {
         return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
//
//category pageDetails
exports.categoryPageDetails = async (req,res)=>{
    try {
        //get categoryId
        const {categoryId} = req.body;

        //get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId).populate("Course").exec()

        //validation
        if(!selectedCategory)
        {
            return res.status(404).json({
                success:false,
                message:"Data Not Found"
            });
        }
        //get courses for different category
        const differentCategories = await Category.find({
            _id: {$ne: categoryId}
        }).populate("course").exec();

        //get top selling courses
        const topCourse = await Course.aggregate([
            {$project:{courseName:1,courseDescription:1,totalStudent:{$size:"$studentEnrolled"}}},
            {$sort:{totalStudent:-1}},{$limit:10}])
        
        return res.status(200).json({
            success:true,
            data:selectedCategory,differentCategories,topCourse
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in category controller",
            error:error.message
        })
    }
}