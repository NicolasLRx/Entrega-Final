import cartServices from "../services/cart.services.js";

const createCart = async (req, res) => {
  try {
    const cart = await cartServices.create();

    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    next(error);
}
};

const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartServices.addProductToCart(cid, pid);

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateQuantityProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartServices.updateQuantityProductInCart(
      cid,
      pid,
      quantity
    );

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartServices.deleteProductInCart(cid, pid);
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartServices.getCartById(cid);
    if (!cart)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el carrito con el id ${cid}`,
      });

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteAllProductsInCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartServices.deleteAllProductsInCart(cid);
    if (!cart)
      return res.status(404).json({
        status: "Error",
        msg: `No se encontró el carrito con el id ${cid}`,
      });

    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsServices.getCartById(cid);
    if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
    // Obtener el total del carrito
    const total = await cartsServices.purchaseCart(cid);
    // Crear el ticket
    const ticket = await ticketServices.createTicket(req.user.email, total);

    res.status(200).json({ status: "success", payload: ticket });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};



export default {
  createCart,
  addProductToCart,
  updateQuantityProductInCart,
  deleteProductInCart,
  getCartById,
  deleteAllProductsInCart,
  purchaseCart,
};
