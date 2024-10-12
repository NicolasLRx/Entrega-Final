import fs from "fs";

//variables
let products = [];
let pathFile = "./src/data/files/products.json";
//metodos

const addProduct = async (product) => {
  const { title, description, price, thumbnail, code, stock } = product;
  await getProducts();
  const newProduct = {
    id: products.length + 1,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status: true,
  };
};

const getProducts = async (limit) => {
  const productsJson = await fs.promises.readFile(pathFile, "utf8");
  products = JSON.parse(productsJson) || [];

  if (!limit) return products;

  return products.slice(0, limit);
};

const getProductByID = async (id) => {
  await getProducts();

  const product = products.find((product) => product.id === id);
  if (!product) {
    console.log(`No se encontro el producto con el ID  ${id}`);
    return;
  }

  console.log(product);
  return product;
};

const updateProduct = async (id, dataProduct) => {
  await getProducts();
  const index = products.findIndex((product) => product.id === id);

  products[index] = {
    ...products[index],
    ...dataProduct,
  };

  await fs.promises.writeFile(pathFile, JSON.stringify(products));
};

const deleteProduct = async (id) => {
  await getProducts();
  products = products.filter((product) => product.id !== id);
  await fs.promises.writeFile(pathFile, JSON.stringify(products));
};

export default {
  addProduct,
  getProducts,
  getProductByID,
  updateProduct,
  deleteProduct,
};
