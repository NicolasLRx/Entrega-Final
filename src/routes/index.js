import { Router } from "express";
import productRouters from "./products.routes.js";
import cartsRoutes from "./cart.routes.js";
import sessionRouters from "./session.routes.js";
import {isLogin} from "../middlewares/isLogin.middlewares.js";
import userRouters from "./user.routes.js";

const router = Router();

router.use("/products", productRouters);
router.use("/carts", cartsRoutes);
router.use("/session",  sessionRouters);
router.use("/user", userRouters);

export default router;
