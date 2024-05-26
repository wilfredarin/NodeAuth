import dotenv from 'dotenv';
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import ejsLayouts from "express-ejs-layouts";
import path from "path";
import passport  from 'passport';
import GoogleStrategy from 'passport-google-oidc';

import userRouter from "./src/features/user/user.routes.js";


const app = express();
app.set("view engine","ejs");
app.set("views",path.join(path.resolve(),"src","views"));
// for below to work have a layout.ejs in views
app.use(ejsLayouts);

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
// app.use(passport.initialize());
// app.use(passport.session());

app.get('/login/federated/google', passport.authenticate('google'));
app.get("/",(req,res)=>{
    //check if loged in 
    return res.render("user-login",{userEmail:req.email,error:null});
})



app.use("/user", userRouter);
export default app;
// 