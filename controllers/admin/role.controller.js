const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/index", {
    titlePage: "Trang nhóm quyền",
    records: records,
  });
};
// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    titlePage: "Trang tạo nhóm quyền",
  });
};
// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const role = new Role(req.body);
  await role.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};
// [GET] /admin/roles/edit
module.exports.edit = async (req, res) => {
  const find = {
    deleted: false,
  };

  const role = await Role.findOne(find);

  res.render("admin/pages/roles/edit", {
    titlePage: "Trang chỉnh sửa nhóm quyền",
    role: role,
  });
};
// [PATCH] /admin/roles/edit
module.exports.editPatch = async (req, res) => {
  try {
    await Role.updateOne(
      {
        _id: req.params.id,
      },
      req.body
    );
    req.flash("success", "Cập nhật thành công");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
  }

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};
