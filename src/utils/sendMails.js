import nodemailer, { createTransport } from "nodemailer";
import envs from "../config/env.config.js";
import __dirname from "../../dirname.js";


export const sendMail = async (email, subject, message, template) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "nicolaslrx@gmail.com",
      pass: envs.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "nicolaslrx@gmail.com",
    to: email,
    subject,
    text: message,
    html:template,
    attachments: [

        {
            filename: "monito.jpg",
            path: __dirname +  "/public/images/monito.jpg",
            cid:"monito",

        }



    ]

  });
};

