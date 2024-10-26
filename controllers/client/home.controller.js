const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");
// [GET] /
module.exports.index = async (req, res) => {
  const products = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);

  const newProducts = productsHelper.priceNewProducts(products);

  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew);

  res.render("client/pages/home/index", {
    titlePage: "Trang chủ",
    newProducts: newProducts,
    productsNew: newProductsNew,
  });
};
