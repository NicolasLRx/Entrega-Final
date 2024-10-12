import { userResponseDto } from "../dto/user-response.dto.js";
import { createToken } from "../utils/jwt.js";

const register = async (req, res) => {
  try {
    res.status(201).json({ status: "success", msg: "Usuario Creado" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const login = async (req, res) => {
  try {
    const user = req.user;
    const token = createToken(user);

    res.cookie("token", token, { httpOnly: true });
    const userDto = userResponseDto(user);

    return res.status(200).json({ status: "success", payload: userDto, token });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const loginGoogle = async (req, res) => {
  try {
    return res.status(200).json({ status: "success", payload: req.user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const current = async (req, res) => {
  try {
    const user = userResponseDto(req.user);
    return res.status(200).json({ status: "success", payload: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();

    res.status(200).json({ status: "success", payload: "Sesion cerrada" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default {
  register,
  login,
  loginGoogle,
  current,
  logout,
};
