import cartServices from "../services/cart.services.js";
import productsServices from "../services/products.services.js";

export const checkProductAndCart = async (
  req = request,
  res = response,
  next
) => {
  const { cid, pid } = req.params;
  const product = await productsServices.getByID(pid);
  const cart = await cartServices.getCartById(cid);

  if (!product)
    return res.status(404).json({
      status: "Error",
      msg: `No se encontró el producto con el id ${pid}`,
    });
  if (!cart)
    return res.status(404).json({
      status: "Error",
      msg: `No se encontró el carrito con el id ${cid}`,
    });

  next();
};
