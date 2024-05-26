// controllers/otpController.js
import mongoose from 'mongoose';
import otpGenerator from 'otp-generator';
import { otpSchema } from './otp.schema.js';
import { userSchema } from '../user/user.schema.js';
import sendEmail from '../../utils/mailSender.js';
import { verifyOTPRepo } from './otp.repository.js';
import { updateUserPassword } from '../user/user.controller.js';
const OTPModel = mongoose.model("OTP",otpSchema);
const UserModel = mongoose.model("User",userSchema);





async function sendVerificationEmail(email, otp) {
    try {
      const mailResponse = await sendEmail(
        email,
        "MyAuthSystem | Password Reset Request",
        `<h1>Please confirm your OTP</h1>
         <p>Here is your OTP code: ${otp}</p>`
      );
      console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
      console.log("Error occurred while sending email: ", error);
      throw error;
    }
  }



export const verifyOTP = async(req,res,next)=>{
  const {otp,newPassword } = req.body;
  const email = req.params.email;
  const resp = await verifyOTPRepo(email,otp);
  if(!resp.success){
    return res.render("user-otp-verification",{email:email,userEmail:req.email,error:resp.message});
  }
  const result = await updateUserPassword(email,newPassword,next);
  if(result.success){
    return res.render("user-login",{userEmail:req.email,error:result.msg});
  }else{
    return res.render("user-otp-verification",{email:email,userEmail:req.email,error:result.msg});
  }
}

export const  getOTPView= (req,res)=>{
  res.render("user-otp-verification",{email:null,userEmail:req.email,error:null});
}


export const sendOTP = async (req, res) => {
    const { email } = req.body;
  try {
    const checkUserPresent = await UserModel.findOne({ email });
    // If user found with provided email
    if (!checkUserPresent) {
      return res.render("user-otp-verification",{email:null,userName:req.username,error: 'User not registered'});
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTPModel.findOne({ otp: otp });
    while (result) {
      //while otp is present - to get new otp
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTPModel.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTPModel.create(otpPayload);
    await sendVerificationEmail(email, otp);
    return res.render("user-otp-verification",{error:"OTP Sent",userEmail:null,email:email});
  } catch (error) {
    console.log(error.message);
    return res.render("user-otp-verification",{userEmail:null,error:error.message});
    // return res.status(500).json({ success: false, error: error.message });
  }
};