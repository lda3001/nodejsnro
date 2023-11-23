var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var config = require("../../config.js");
module.exports = {
  name: "auth/login",
  method: "POST",
  middleware: [],
  run: ({ req, res, sql }) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        error: true,
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    sql.query("SELECT * FROM user WHERE username = ?", [username], async (err, results) => {
      if (err) {
        console.error("Lỗi khi kiểm tra user:", err);
        return res.json({
          error: true,
          message: "Lỗi khi kiểm tra user",
        });
      }

      if (results.length === 0) {
        return res.json({
          error: true,
          message: "Tên người dùng không tồn tại",
        });
      }

      const storedHash = results[0].password;
      const inputHash = crypto.createHash("md5").update(password).digest("hex");

      if (storedHash !== inputHash) {
        return res.json({
          error: true,
          message: "Mật khẩu không chính xác",
        });
      }

      var signature = await jwt.sign(
        {
          username,
        },
        config.jwt_secretkey,
        { expiresIn: "7d" }
      );
      const thirtyDaysInSeconds = 7 * 24 * 60 * 60;
      const expires = new Date(Date.now() + thirtyDaysInSeconds * 1000);
      res.cookie("signature", signature, { expires, httpOnly: true });
      res.cookie("username", username, { expires, httpOnly: true });
      return res.json({
        error: false,
        message: "Đăng nhập thành công",
        data: signature,
      });
    });
  },
};
