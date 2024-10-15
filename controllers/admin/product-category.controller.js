const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const listCategory = await ProductCategory.find({status: "active"});
  res.render("admin/pages/products-category/index", {
    titlePage: "Trang danh mục sản phẩm",
    listCategory: listCategory,
  });
};
// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products-category/create", {
    titlePage: "Tạo danh mục sản phẩm",
  });
};
// [GET] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  console.log(req.body);
  if (req.body.position == "") {
    const countProduct = await ProductCategory.countDocuments();
    req.body.position = countProduct + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const record = new ProductCategory(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
