import dotenv from 'dotenv';
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import ejsLayouts from "express-ejs-layouts";
import path from "path";
import passport  from 'passport';
import session from "express-session";
import jwt from "jsonwebtoken";

import {googlePassportConfig} from './src/config/passport-google.js'; 
import userRouter from "./src/features/user/user.routes.js";
import otpRouter from "./src/features/otp/otp.routes.js"

const app = express();
app.set("view engine","ejs");
app.set("views",path.join(path.resolve(),"src","views"));
// for below to work have a layout.ejs in views
app.use(ejsLayouts);
app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: false
  }));

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
googlePassportConfig(passport); 

// app.use(passport.initialize());
// app.use(passport.session());


app.get("/",(req,res)=>{
    //check if loged in 
    return res.render("user-login",{userEmail:req.email,error:null});
})

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// Google authentication callback route
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    //see the structure of req object to understaand better
    const payload = {_id: req.user._id, email: req.user.email };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.cookie('jwtToken', token, { httpOnly: true });
      res.redirect('/user/home');
    });
  }
);

app.use("/user", userRouter);
app.use("/otp",otpRouter);
export default app;
// 