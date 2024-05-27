import mongoose from "mongoose";
import passport  from 'passport';
import {userSchema} from '../features/user/user.schema.js';
const UserModel = mongoose.model("User", userSchema);
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import axios from 'axios';


export const revokeGoogleToken = async (accessToken) => {
  try {
    await axios.post('https://oauth2.googleapis.com/revoke', null, {
      params: {
        token: accessToken,
      },
    });
    console.log('Google access token revoked successfully');
  } catch (error) {
    console.error('Error revoking Google access token:', error.response.data);
  }
};

export const googlePassportConfig =  function(passport){
  passport.use(new GoogleStrategy({
      // clientID: process.env.GOOGLE_CLIENT_ID,
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    }, 
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ googleId: profile.id });
        if (!user) {
          user = new UserModel({
            googleId: profile.id,
            email: profile.emails[0].value,
            accessToken: accessToken
          });
          await user.save();
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }));
    

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
