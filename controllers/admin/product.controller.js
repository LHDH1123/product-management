const Product = require("../../models/product.model");
const Category = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchStatusHelper = require("../../helpers/search");
const panigationHelper = require("../../helpers/panigation");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const Account = require("../../models/account.model");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  const objectSearch = searchStatusHelper(req.query);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const totalProduct = await Product.countDocuments(find);
  let objectPage = panigationHelper(
    {
      currentPage: 1,
      limitItem: 4,
    },
    req.query,
    totalProduct
  );

  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPage.limitItem)
    .skip(objectPage.skipItem);

  for (const product of products) {
    const user = await Account.findOne({
      _id: product.createdBy.account_id,
    });
    if (user) {
      product.accountFullName = user.fullName;
    }
    const updatedBy = product.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const userUpdatedBy = await Account.findOne({
        _id: updatedBy.account_id,
      });
      if (userUpdatedBy) {
        product.accountFullName = userUpdatedBy.fullName;
      }
    }
  }

  res.render("admin/pages/products/index", {
    titlePage: "Trang danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    panigation: objectPage,
  });
};
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = [
    {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    },
  ];

  await Product.updateOne(
    { _id: id },
    { status: status, $push: { updatedBy: updatedBy } }
  );
  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect("back");
};
// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  const updatedBy = [
    {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    },
  ];

  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "active", $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`
      );
      break;
    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        { status: "inactive", $push: { updatedBy: updatedBy } }
      );
      req.flash(`Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
      break;
    case "delete":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Đã xóa ${ids.length} sản phẩm thành công!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne(
          { _id: id },
          { position: position, $push: { updatedBy: updatedBy } }
        );
      }
      req.flash(
        "success",
        `Thay đổi vị trí ${ids.length} sản phẩm thành công!`
      );
      break;
    default:
      break;
  }
  res.redirect("back");
};
// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  //Xóa trong DB
  // await Product.deleteOne({_id: id});
  //Xóa mềm
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );

  req.flash("success", `Xóa sản phẩm thành công!`);
  res.redirect("back");
};
// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const category = await Category.find({
    deleted: false,
  });
  const newCategory = createTreeHelper.tree(category);
  res.render("admin/pages/products/create", {
    titlePage: "Thêm mới sản phẩm",
    category: newCategory,
  });
};
// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
      const countProduct = await Product.countDocuments();
      req.body.position = countProduct + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    console.log(res.locals.user.id);

    req.body.createdBy = {
      account_id: res.locals.user.id,
    };

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
  }
};
// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const category = await Category.find({
      deleted: false,
    });
    const newCategory = createTreeHelper.tree(category);

    const product = await Product.findOne(find);

    const category_id = await Category.findOne({
      _id: product.product_category_id,
    });

    res.render("admin/pages/products/edit", {
      titlePage: "Sửa sản phẩm",
      product: product,
      category: newCategory,
      category_id: category_id,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  try {
    const updatedBy = [
      {
        account_id: res.locals.user.id,
        updatedAt: new Date(),
      },
    ];

    await Product.updateOne(
      {
        _id: req.params.id,
      },
      { ...req.body, $push: { updatedBy: updatedBy } }
    );
    req.flash("success", `Cập nhật thành công!`);
  } catch (error) {
    req.flash("error", `Cập nhật thất bại!`);
  }

  res.redirect(`${systemConfig.prefixAdmin}/products`);
  // res.redirect("back");
};
// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      titlePage: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
// [GET] /admin/products-category
module.exports.category = async (req, res) => {
  res.render("admin/pages/products-category/category", {
    titlePage: "Trang danh mục sản phẩm",
  });
};
