import swaggerJSDoc from "swagger-jsdoc";
import __dirname from "../../dirname.js"
const swaggerOptions = {


    swaggerDefinition: {

        openapi: "3.0.1",
        info: {
            title: "Documentacion de API E-Commerce",
            version: "1.0.1",
            description: "APi e-commerce para curso de BE"
        },

    },
    apis:[`${__dirname}/src/docs/**/*.yaml`]

}

export const specs = swaggerJSDoc(swaggerOptions);
