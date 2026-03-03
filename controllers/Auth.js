const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();




//sendOTP
exports.sendOTP = async (req,res)=>{
    try {
         //Fetch email from req Body
        const {email} = req.body;

        //Check that user already exist 
        const checkUserPresent = await User.findOne({email});

        // if user already exist => return a response
        if(checkUserPresent){
            return res.status(401).json({
            success:false,
            message:'User already exist',
            })
        }
        //Genrate OTP
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated ",otp);
        //check unique OTP or Not
        const result = await OTP.findOne({otp:otp})
        while(result){
            otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
            });
            result = await OTP.findOne({otp:otp})
        }
        const otpPayload = {email,otp};
        //create an entry for OTP
        const otpBody = await OTP.create(otpPayload)
        console.log(otpBody)
        //return response successfully
        res.status(200).json({
            sucess:true,
            message:"OTP Send Successfully",
            otp
        })
    } catch (error) {
        console.log("error in sendOTP",error)
            return res.status.json({
                success:true,
                message:error.message
            })
        }
}

//signUp
exports.signUp = async (req,res)=>{
        try {
            //data fetch from request body
        const {firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp} = req.body;
        //validate
        if(!firstName || !lastName || !email || !password || !confirmPassword ||  !otp){
            return res.status(403).json({
                sucess:false,
                message:"All fields are required"
            })
        }
        //match 2 password

        if(password !== confirmPassword){
            res.status(400).json({
                success:false,
                message:"Password and ConfirmPassword Value does not match, please try again"
            })
        }
        //check user already exist or not 
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already registered"
            })
        }


        //find most recent OTP stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}.limit(1))
        console.log("Recent OTP",recentOtp)

        //validate OTP
        if (recentOtp.length == 0) {
            //OTP not found
            return res.status.json({
                success:false,
                message:"OTP not Found"
            })
        } else if(otp !== recentOtp.otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password,10);
        //entry create in DB
        const profileDetails = await Profile.create({gender:null,dateOfBirth:null,about:null,contactNumber:null})
        const user = await User.create({
            firstName,
            lastName,email,contactNumber,password:hashedPassword,accountType,additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`
        })
        return res.status(200).json({
            success:true,
            message:"User is registered successfully",
            user
        })
    
    } catch (error) {
        console.log("error in SignUp ", error)
        return res.status(500).json({
            success:false,
            message:"User cannot be registered. Please try again"
        })
    }
}

//Login

exports.login = async (req,res)=>{
    try {
        //get data from req body
        const {email,password} =req.body;

        //validation
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Input Credential"
            })
        }
        //User Check exist 
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signUp first"
            });
        }
        //Generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            // user.toObject();
            user.token = token;
            user.password = undefined

            const options = {
                expires: new Date(Date.now()+ 3*24*60*60*1000)
            }
            //Create cookie and send response
            res.cookie("token",token,options).status(200).json({
                success:true,
                token:token,
                user,
                message:"Logged In"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",

            })
        }

    } catch (error) {
        console.log("code blast in login ", error)
        return res.status(500).json({
            success:false,
            message:"Login failure, please try again"
        })
    }
    
}

//changePassword

exports.changePassword = async (req,res)=>{
    //get data from req body
    //get oldPassword, newPassword, confirmNewPassword
    //validation
    

    //update password in DB
    //send mail - password update
    //return response
}