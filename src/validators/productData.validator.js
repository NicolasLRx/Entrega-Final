import { body, validationResult } from "express-validator";

export const productDataValidartor = [
  body("title")
    .isString()
    .withMessage("El titulo debe ser un texto")
    .notEmpty()
    .withMessage("El titulo es obligatorio")
    .isLength({ min: 4 })
    .withMessage("Tiene que tener al menos 4 caracteres"),
  body("description")
    .isString()
    .withMessage("La descripcion debe ser un texto")
    .notEmpty()
    .withMessage("La descripcion es obligatoria")
    .isLength({ min: 4 })
    .withMessage("Tiene que tener al menos 4 caracteres"),
  body("thumbnail").isArray().withMessage("Tiene que ser un array"),
  body("code")
    .isString()
    .withMessage("El codigo debe ser un texto")
    .notEmpty()
    .withMessage("El codigo es obligatorio")
    .isLength({ min: 4 })
    .withMessage("Tiene que tener al menos 4 caracteres"),
  body("stock")
    .isNumeric()
    .withMessage("El stock debe ser un numero")
    .notEmpty()
    .withMessage("El stock es obligatorio")
    .isLength({ min: 1 })
    .withMessage("Tiene que tener al menos 1 caracteres"),
  body("status").isBoolean(),

  body("price")
    .isNumeric()
    .withMessage("El precio debe ser un numero")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isLength({ min: 1 })
    .withMessage("Tiene que tener al menos 1 caracteres"),
  body("category")
    .isString()
    .withMessage("La categoria debe ser un texto")
    .notEmpty()
    .withMessage("La categoria es obligatorio")
    .isLength({ min: 4 })
    .withMessage("Tiene que tener al menos 4 caracteres"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formatErrors = errors
        .array()
        .map((e) => ({ msg: e.msg, data: e.path }));

      return res.status(400).json({ status: "error", payload: formatErrors });
    }

    next();
  },
];
