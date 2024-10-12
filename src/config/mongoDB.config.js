import mongoose from "mongoose";
import envs from "./env.config.js";
import { logger } from "../utils/logger.js";

const urlDB = envs.MONGO_URL;

export const connectMongoDB = async () => {
  try {
    //conexion con la base de datos
    mongoose.connect(urlDB);
    logger.info("Mongo DB conectado");                                               
  } catch (error) {
    console.log(error);
  }
};
