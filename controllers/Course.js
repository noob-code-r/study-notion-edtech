const Course = require("../models/Course")
const Tag = require("../models/Tags")
const User = require("../models/User")
const {uploadImageToCloudinary} = require("../utils/imageUploader")
require("dotenv").config();

//create course handler function
exports.createCourse = async (req,res)=>{
    try{
      // fetch all data
      const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;
      
      //get thumbnail
      const thumbnail = req.files.thumbnailImage;
    
      //validation 
      if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success:false,
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
      //check given tag is valid or not
      const tagDetails = await Tag.findById({tag})

      if(!tagDetails){
         return res.status(404).json({
            success:false,
            message:"Tag not found"
        })
      }
      //Upload image to cloudinary
      const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

      //create an entry for new course
      const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor:instructorDetails._id,
        whatYouWillLearn,
        price,
        tag:tagDetails._id,
        thumbnail:thumbnailImage.secure_url})


        //add the new course schema of instructor
        await User.findByIdAndUpdate({_id: instructorDetails._id},{
          $push:{courses: newCourse._id}
        },{returnDocument:"after"})


        //Update the TAG Schema
        await Tag.findByIdAndUpdate(tag,
          {
            $push:{
              course: newCourse._id
            }
          },
          {returnDocument:"after"}
        )


        console.log("New Course Created")
        return res.status(200).json({
          success:true,
          message:"Course Created Successfully",
          data:newCourse
        })

        
    }catch(error){
      console.error(error);
      return res.status(500).json({
        success:false,
        message:"Failed to create course",

      })
    }
}

//getAllCourses handler function

exports.showAllCourses = async (req,res) =>{
  try {

    //find call 
    //TODO: change the below statement 
    const allCourses = await Course.find({})

      return res.status(200).json({
        success:true,
        message:"data for all courses fetched successfully",
        data:allCourses
      })

  } catch (error) {
    console.error(error);
      return res.status(500).json({
        success:false,
        message:"Failed to fetch course data",
        error:error.message
      })
  }
}