var { isLogin, isAdmin } = require("../../middleware/auth.middleware")
var { active_coins } = require("../../config")
module.exports = {
    name: "active",
    middleware: [isAdmin],
    method: "get",
    run: async({ req, res, user }) => {
        var user = await user.getInfo();
        var currentCoins = user[0].vnd;
        if(currentCoins < active_coins) {
            return res.json({
                error: true,
                message: `Bạn còn thiếu ${active_coins - currentCoins} coins để kích hoạt!`
            })
        }
        if(user[0].role == 1) {
            return res.json({
                error: false,
                message: `Bạn đã kích hoạt rồi`
            })
        }
    },
  };
  