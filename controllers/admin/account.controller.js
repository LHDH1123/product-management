const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }
  res.render("admin/pages/accounts/index", {
    titlePage: "Trang danh sách tài khoản",
    records: records,
  });
};
// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const roles = await Role.find(find);
  res.render("admin/pages/accounts/create", {
    titlePage: "Trang thêm tài khoản",
    roles: roles,
  });
};
// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExits = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExits) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};
// [GET] /admin/accounts/edit
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };

  const records = await Account.findOne(find);
  const roles = await Role.find({ deleted: false });
  res.render("admin/pages/accounts/edit", {
    titlePage: "Cập nhật tài khoản",
    account: records,
    roles: roles,
  });
};
// [PATCH] /admin/accounts/edit
module.exports.editPatch = async (req, res) => {
  try {
    const emailExits = await Account.findOne({
      _id: { $ne: req.params.id },
      email: req.body.email,
      deleted: false,
    });

    if (emailExits) {
      req.flash("error", `Email ${req.body.email} đã tồn tại`);
      res.redirect("back");
    } else {
      await Account.updateOne(
        {
          _id: req.params.id,
        },
        req.body
      );
      req.flash("success", `Cập nhật thành công`);
    }
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    console.log(error);
    req.flash("error", `Cập nhật thất bại`);
    res.redirect("back");
  }
};
