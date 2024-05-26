import passport  from 'passport';


const UserModel = mongoose.model("User", userSchema)



import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';
// import config from './config.js';

passport.use(new GoogleStrategy({
  clientID: config.googleClientID,
  clientSecret: config.googleClientSecret,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
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
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  
