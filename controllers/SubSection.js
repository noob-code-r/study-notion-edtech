const SubSection = require("../models/SubSection")
const Section = require("../models/Section");
const { uploadImageToCloudinary, deleteAsset } = require("../utils/imageUploader");
require("dotenv").config()


//SubSection handler

exports.createSubsection = async (req,res)=>{
    try {
        //fetch data from Req body
        const {title,description,sectionId,timeDuration} = req.body;

        //extract file/video
        const video = req.files.videoFile;

        //validation
        if(!title || !description || !sectionId || !timeDuration || !video){
                return res.status(400).json({
                    success:false,
                    message:"All fields are required"
                })
        }

        //upload video to cloudinary
        const uploadDetails= await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        const secureUrl = uploadDetails.secure_url;
        const publicId = uploadDetails.public_id;

        //create a sub-Section
        const subSectionDetails =  await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:secureUrl,
            publicId:publicId
        })
        //update section with this sub section ObjectId
        const updatedSection = await Section.findByIdAndUpdate(sectionId,{
            $push: {SubSection:subSectionDetails._id}
        },{returnDocument:"after"}).populate("SubSection").exec()
        //HW: log updated section here, after adding populate query


        //return response
        return res.status(200).json({
            success:true,
            message:"Sub-section Created successfully",
            updatedSection
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Failed to created sub-section"
        })
    }
}

//HW: UpdateSubSection 


exports.updateSubSection = async (req,res)=>{
    try {
        //fetch data
        const {title,timeDuration,description,subSectionId} = req.body;

        //validation
        if(!title || !timeDuration || !description  || !subSectionId){
            return res.status(400).json({
                success:false,
                message:"Please Enter All fields"
            })
        }
       
        //update
        const updatedSubSection =await SubSection.findByIdAndUpdate(subSectionId,{
            title:title,
            timeDuration:timeDuration,
            description:description,},{new:true})

            //return
            return res.status(200).json({
                success:true,
                message:"Updated Successfully",
                updatedSubSection
            })
    } catch (error) {
      return res.status(500).json({
        success:false,
        message:error.message
      })  
    }
}


//HW: delete SubSection

exports.deleteSubSection = async (req,res)=>{
    try {
        //fetch id of section and SubSection
        const {subSectionId,sectionId} = req.body;

        //Validation
        if(!subSectionId || !sectionId){
            return res.status(400).json({
                    success:false,
                    message:"Please Enter All fields"
                })
        }
        //delete video file from cloudinary
        const subSectionDetails = await SubSection.findById(subSectionId);
        const publicId =  subSectionDetails.publicId;
        const result = await deleteAsset(publicId);
        
        //delete from database
        await SubSection.findByIdAndDelete(subSectionId)

        await Section.findByIdAndUpdate(sectionId,{
            $pull:{SubSection:subSectionId}
        })

        return res.status(200).json({
            success:true,
            message:"Successfully Deleted"
        })

    } catch (error) {
        return res.status(500).json({
        success:false,
        message:error.message
      })  
    }
}