const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productsHelper = require("../../helpers/product");
const productsCategoryHelper = require("../../helpers/products-category");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    titlePage: "Sản phẩm",
    products: newProducts,
  });
};
// [GET] /products/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      status: "active",
      slug: req.params.slugProduct,
    };

    const product = await Product.findOne(find);

    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        deleted: false,
        status: "active",
      });

      product.category = category;
    }

    product.priceNew = productsHelper.priceNewProduct(product);

    res.render("client/pages/products/detail", {
      titlePage: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};

// [GET] /products
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
    status: "active",
  });

  const listCategory = await productsCategoryHelper.getSubCategory(category.id);

  const listCategoryId = listCategory.map((item) => item.id);

  const productsCategory = await Product.find({
    product_category_id: { $in: [category.id, ...listCategoryId] },
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  res.render("client/pages/products/index", {
    titlePage: category.title,
    products: productsCategory,
  });
};
