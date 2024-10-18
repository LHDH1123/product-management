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
// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  const listCategory = await ProductCategory.find({
    deleted: false,
  });

  const category = await ProductCategory.findOne({
    deleted: false,
    _id: req.params.id,
  });

  res.render("admin/pages/products-category/edit", {
    titlePage: "Chỉnh sửa danh mục sản phẩm",
    category: category,
    listCategory: listCategory,
  });
};
// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.position = parseInt(req.body.position);
  await ProductCategory.updateOne(
    {
      _id: req.params.id,
    },
    req.body
  );

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
