const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const record = await ProductCategory.find({
    deleted: false,
  }).sort({ position: "asc" });

  const newRecord = createTreeHelper.tree(record);
  res.render("admin/pages/products-category/index", {
    titlePage: "Trang danh mục sản phẩm",
    listCategory: newRecord,
  });
};
// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const record = await ProductCategory.find(find).sort({ position: "asc" });

  const newRecord = createTreeHelper.tree(record);

  res.render("admin/pages/products-category/create", {
    titlePage: "Tạo danh mục sản phẩm",
    record: newRecord,
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
  const productCategory = new ProductCategory(req.body);
  await productCategory.save();

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
