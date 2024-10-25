// [GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    titlePage: "Trang thông tin cá nhân",
  });
};
