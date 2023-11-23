const { isLogin, isAdmin } = require("../../middleware/auth.middleware")

module.exports = {
    name: "profile",
    method: "GET",
    middleware: [isLogin],
    run: async({ req, res, user, options }) => {
      res.render("page/profile.ejs", {
        user: await user.getInfo(),
        options,
      });
    },
  };
  