const Course = require("../models/Course")
const Tag = require("../models/Tags")
const User = require("../models/User")
const {uploadImageToCloudinary} = require("../utils/imageUploader")

//create course handler function
exports.createCourse = async (req,res)=>{
    try{
      // fetch all data
      const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body
      
      //get thumbnail
      const thumbnail = req.files.thumbnailImage;
    
      //validation 
      if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success:true,
                message:"Fill input Field"
            })
      }

      //check instructor
      
      const userId = req.user.id;
      const instructorDetails = await User.findById(userId);
      console.log("Instructor Details ", instructorDetails);

      if(!instructorDetails){
        return res.status(404).json({
            success:false,
            message:"Instructor details not found"
        })
      }



    }catch(error){

    }
}

//getAllCourses handler function