import passport from "passport";
import google from "passport-google-oauth20";
import jwt from "passport-jwt";
import local from "passport-local";
import userRepository from "../persistences/mongo/repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import envs from "./env.config.js";

const LocalStrategy = local.Strategy;
const GoogleStrategy = google.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtracto = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies.token;
  }

  return token;
};

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },

      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age, role } = req.body;
          const user = await userRepository.getByEmail(username);
          if (user)
            return done(null, false, { message: "El usuario ya existe" });

          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role,
          };
          const createUser = await userRepository.create(newUser);
          return done(null, createUser);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userRepository.getByEmail(username);
          if (!user || !isValidPassword(user, password))
            return done(null, false, { msg: "email o password invalidos" });

          return done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtracto]),
        secretOrKey: envs.JWT,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: envs.GOOGLE_CLIENT_ID,
        clientSecret: envs.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/session/login/google",
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const { name, emails } = profile;
          const user = {
            first_name: name.givenName,
            last_name: name.familyName,
            email: emails[0].value,
          };

          const existUser = await userRepository.getByEmail(emails[0].value);
          if (existUser) return cb(null, existUser);

          const newUser = await userRepository.create(user);
          cb(null, newUser);
        } catch (error) {
          return cb(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userRepository.getByID(id);
    done(null, user);
  });
};
export default initializePassport;
