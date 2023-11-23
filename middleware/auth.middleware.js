var jwt = require("jsonwebtoken");
var config = require("../config");
module.exports = {
  isLogin: (req, res, next) => {
    var token = req.cookies?.signature;
    try {
      jwt.verify(token, config.jwt_secretkey, (err, decoded) => {
        if (err) {
          return res.redirect("/login");
        }
        next();
      });
    } catch (e) {
      res.clearCookie("signature");
      res.redirect("/login");
    }
  },
  isAdmin: (req, res, next) => {
    try {
      var username = req.cookies?.username;
      global.sql.query("SELECT * FROM user WHERE username = ?", [username], (err, results) => {
        if (err) {
          console.error("Lỗi khi kiểm tra user:", err);
          resolve({
            error: true,
            message: "Lỗi khi kiểm tra user",
          });
        }
        if (results[0]?.role === 1) {
          next();
        } else {
          res.send("<h1>Bạn không có quyền để truy cập vào đây!</h1><br><h2>Vui lòng trở về trang chủ</h2>");
        }
      });
    } catch (err) {
      res.redirect("/login");
    }
  },
};
