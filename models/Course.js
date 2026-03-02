const mongoose = require("mongoose")


const courseSchema = new mongoose.Schema({
   courseName:{
    type:String,
    required:true,
   },
   courseDescription:{
    type:String,
    required:true,
   },
   instructor:{
    type:String,
    required:true,
   },
   whatYouWillLearn:{
    type:String,
    required:true,
   },
   courseContent:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Section"
   }],
   ratingAndReviews:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"RatingAndReview"
   }],
   price:{
    type:Number,
   },
   thumbnail:{
    type:String
   },
   tag:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Tag"
   },
   studentEnrolled:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   }]
}) 

module.exports = mongoose.model("Course",courseSchema)