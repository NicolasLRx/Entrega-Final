import fs from "fs";

//variables
let carts = [];
let pathFile = "./src/data/files/carts.json";

const getCarts = async () => {
  const cartsJson = await fs.promises.readFile(pathFile, "utf8");
  carts = JSON.parse(cartsJson) || [];

  return carts;
};

const createCart = async () => {
  await getCarts();

  const newCart = {
    id: carts.length + 1,
    products: [],
  };

  carts.push(newCart);

  await fs.promises.writeFile(pathFile, json.stringinfy(carts));

  return newCart;
};

export default {
  getCarts,
  createCart,
};
