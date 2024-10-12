import express, { response } from "express";
import router from "./routes/index.js";
import {connectMongoDB} from "./config/mongoDB.config.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import envs from "./config/env.config.js";
import swaggerUiExpress from "swagger-ui-express";
import { errorHandle } from "./errors/errorHandle.js";
import { logger } from "./utils/logger.js"
import { specs } from "./config/swagger.config.js"
import cors from "cors";

connectMongoDB();


//creo aplicacion/servidor
const app = express();

//para configurar el servidor con determinadas funcionalidades
app.use(express.json()); //para manejar json
app.use(express.urlencoded({ extended: true })); //para leer queries y params
app.use(cookieParser(envs.COOKIE_SECRET));
app.use(session({
    store: MongoStore.create({
        mongoUrl: envs.MONGO_URL,
        ttl: 15
    }),
    secret: envs.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));

app.use (passport.initialize());
app.use (passport.session());
initializePassport();
app.use(cors());

app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use("/api", router);

app.use(errorHandle);

app.listen(envs.PORT, () =>{

  logger.info(`Server ready on port: ${envs.PORT}`);

  });