module.exports = {
    name: "download",
    method: "get",
    middleware: [],
    run: async({ req, res, user, options }) => {
      res.render("page/download.ejs", {
        user: await user.getInfo(),
        options,
      });
    },
  };
  