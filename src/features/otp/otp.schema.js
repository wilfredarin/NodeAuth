import mongoose from "mongoose";

export const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*5 //documet expire in 5min
    }
});

//pre-save hook for automatically sending mail - when OTP doc gets created


// otpSchema.pre("save", async function(next){
//     console.log("New OTP Doc saved to db");
//     //only send documenet - on creation - .isNew property
//     if(this.isNew){
//         await sendVerificationEmail(this.email,this.otp);
//     }
//     next();
// })