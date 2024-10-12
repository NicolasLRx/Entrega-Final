import dotenv from "dotenv";

const enviroment = "PRODUCTION";
dotenv.config({
    path: enviroment === "PRODUCTION" ? "./.env.prod" : "./.env.dev"
});

export default {

PORT: process.env.PORT,
MONGO_URL: process.env.MONGO_URL,
SESSION_SECRET: process.env.SESSION_SECRET,
COOKIE_SECRET: process.env.COOKIE_SECRET,
JWT: process.env.JWT,
GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
GMAIL_PASS: process.env.GMAIL_PASS,


}