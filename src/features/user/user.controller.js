import {
    updateUserPasswordRepo,
    userLoginRepo,
    userRegisterationRepo
  } from "./user.repository.js";
  import jwt from "jsonwebtoken";
  import bcrypt from "bcrypt";
import { revokeGoogleToken } from "../../config/passport-google.js";
 import path from "path";


  export const userRegisteration = async (req, res, next) => {
    let { password } = req.body;
    console.log(req.body);
    password = await bcrypt.hash(password, 12);
    const resp = await userRegisterationRepo({email:req.body.email,password:password});
    if (resp.success) {
      res.render("user-login",{userEmail:req.email,error:null});
    } else {
      res.render("user-register",{error:resp.error.msg,userEmail:req.email});
      // next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
    }
  };
  
  export const userLogin = async (req, res, next) => {
    const resp = await userLoginRepo(req.body);
    
    if (resp.success) {
      
      const token = jwt.sign(
        //after image buffer - changed it to not pass entire user (earlier it was user:resp.res)
        { _id: resp.res._id, email: resp.res.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      console.log(req.body.email)
      res
        .cookie("jwtToken", token, { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
        .cookie("wilfredarin", "coolestCoder", { maxAge: 1 * 60 * 60 * 1000, httpOnly: true })
        .redirect("/user/home");
    } else {
      res.render("user-login",{error:resp.error.msg,userEmail:req.email});
      
    }
  };

  export const updateUserPassword = async (email,newPassword,next) => {
    const resp = await updateUserPasswordRepo(email,newPassword,next);
    return resp;
  };
  
  
  export const userLogout = (req, res, next) => {
    revokeGoogleToken(req.user.accessToken);
    res.clearCookie("jwtToken").redirect("/");
  };
  

  export const getUserRegistration = (req,res,next)=>{
    res.render("user-register",{userEmail:req.email,error:null});
  }

  export const getUserLogin = (req,res,next)=>{
    res.render("user-login",{userEmail:req.email,error:null});
  }


  export const homePage = (req,res,next)=>{
    res.render("home",{userEmail:req.email,error:null});
  }