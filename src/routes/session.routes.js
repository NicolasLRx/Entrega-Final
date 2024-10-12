import { Router } from "express";
import passport from "passport";
import sessionControllers from "../controllers/session.controller.js";
import { authorization, passportCall } from "../middlewares/passport.middleware.js";
import { sendMail } from "../utils/sendMails.js";
import { generateUsersMocks } from "../mocks/user.mocks.js";

const router = Router();

router.post("/register", passportCall("register"), sessionControllers.register);

router.post("/login", passportCall("login"), sessionControllers.login);

router.get("/current", passportCall("jwt"), authorization("user"), sessionControllers.current);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
    session: false,
  }),
  sessionControllers.loginGoogle
);

router.get("/logout", sessionControllers.logout);

router.get("/email", async (req, res) => {
  const { name } = req.body;

  const template = `
    <div>
      <h1> Bienvenidos ${name} a nuestra App </h1> />
    </div>
    `;

  await sendMail("nicolaslrx@gmail.com", "Test nodemailer", "Este es un mensaje de prueba", template);

  return res.status(200).json({ status: "ok", msg: "Email enviado" });
});

router.get("/usersmocks", async (req, res) => {
  const users = generateUsersMocks(10000);

  return res.status(200).json({ status: "ok", users });
});

export default router;