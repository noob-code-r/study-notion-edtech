const User = require("../models/User")
const mailSender = require("../utils/mailsender")
const bcrypt = require("bcrypt")

//resetPasswordToken
exports.resetPasswordToken = async (req,res)=>{
   try {
     //fetch Email id
    const {email} = req.body;

    //check for email in DB
    const isEmailPresent = await User.findOne({email})
    if(!isEmailPresent)
    {
        return res.status.json({
            success:false,
            message:"User did not Exist"
        })
    }
    //Generate Token
    const token = crypto.randomUUID();
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate({email:email},{token:token,
                                                                      resetPasswordExpires: Date.now() + 5 * 60 *1000
                                                                       },{ returnDocument: 'after' })

    
    //create url
    const url =`http://localhost:3000/update-password/${token}`
    //send mail containing the url
    await mailSender(email,"Password Reset Link",`password reset Link: ${url}`)
    //return response                                                               
    return res.json({
        success:true,
        message:"Email Sent Successfully, Please check email and Change Pasword"
    })
    
   } catch (error) {
    console.log("Code blast in ResetPassword ",error)
    return res.status(500).json({
        success:false,
        message:"Something went wrong while reseting Password"
    })
   }
}

//reset password
exports.resetPassword = async (req,res)=>{
   try {
     //data fetch
    const {password,confirmPassword, token} = req.body;
    

    //validation
    if(password !== confirmPassword){
        return res.json({
            success:false,
            message:"Password Field misMatched"
        })
    }
    //get userdetails from db using token
    const userDetails = await User.findOne({token: token})

    //if No entry
    if(!userDetails)
    {
        return res.status(401).json({
            success:false,
            message:"Token is Invalid "
        })
    }
    //token time check
    if(userDetails.resetPasswordExpires< Date.now())
    {
        return res.json({
            success:false,
            message:"Token is Expired, Please regenrate your token"
        })
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password,10)

    //password update
    await User.findOneAndUpdate(
        {token:token},{password:hashedPassword},{returnDocument:"after"}
    )
    //response 
    return res.status(200).json({
        success:true,
        message:"Password reset successful"
    })

   } catch (error) {
    console.log("Code Blast in ResetPassword ", error)
    return res.status(500).json({
        success:false,
        message:"Something went wrong on Reseting the Password"
    })
   }
}