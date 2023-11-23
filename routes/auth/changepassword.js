var { isLogin } = require("../../middleware/auth.middleware")
var crypto = require("crypto");
module.exports = {
    name: "auth/changepassword",
    middleware: [isLogin],
    method: "post",
    run: async({ req, res, next, user }) => {
        try {
            var { old_pass, new_pass } = req.body;
            console.log(req.body)
            const passwordPattern = /^[a-z0-9]+$/i;

            if (!passwordPattern.test(new_pass)) {
              return res.json({
                error: true,
                message: "Mật khẩu không được chứa ký tự đặc biệt, chữ in hoa, khoảng trắng!",
              });
            }
            if(!old_pass || !new_pass){
                return res.json({
                    error: true,
                    message: "Vui lòng nhập đầy đủ thông tin !"
                })
            }
            var user = await user.getInfo();
            if(!user.length){
                return res.json({
                    error: true,
                    message : "Không tìm thấy người dùng trong database!"
                })
            }
            const hashOldPassword = crypto.createHash("md5").update(old_pass).digest("hex");
            if(hashOldPassword != user[0].password){
                return res.json({
                    error: true,
                    message: "Mật khẩu cũ không đúng !"
                })
            }
            const hashNewPassword = crypto.createHash("md5").update(new_pass).digest("hex");
            global.sql.query("UPDATE user SET password = ? WHERE username = ?", [hashNewPassword, user[0].username], (err, results) =>{
                if(err){
                    return res.json({
                        error: true,
                        message: "Đã xảy ra lỗi tại hệ thống!"
                    })
                }
                return res.json({
                    error: false,
                    message: "Đổi mật khẩu thành công!"
                })
            })
        } catch(err){
            next(err)
        }
    },
  };
  