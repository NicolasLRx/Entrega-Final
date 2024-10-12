export const productResponseDto = (product) => {
  return {
    title: product.title,
    description: product.title,
    thumbnail: product.thumbnail,
    product_code: product.code,
    stock: product.stock,
    price: product.price,
    category: product.category,
  };
};
