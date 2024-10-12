import jwt from "jsonwebtoken";
import envs from "../config/env.config.js"

// Crear el token
export const createToken = (user) => {
  const { _id, email, role, cart } = user;
  const token = jwt.sign({ _id, email, role, cart }, envs.JWT, { expiresIn: "1m" });
  return token;
};

// Verificar el token
export const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, envs.JWT);
    return decode;
  } catch (error) {
    return null;
  }
};