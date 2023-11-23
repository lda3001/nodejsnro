module.exports = {
    name: "bxh",
    method: "GET",
    middleware: [],
    run: async ({ req, res, user, options }) => {
        try {
            var { type } = req.query;
            if(!['topsm', 'topgiauco'].includes(type)){
                res.redirect("/bxh?type=topsm")
            }
            var queryDatabase = (query) => {
                return new Promise((resolve, reject) => {
                    sql.query(query, (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                });
            };
            var [totalUsersResult, allUserResult] = await Promise.all([queryDatabase("SELECT COUNT(*) AS totalUsers FROM user"), queryDatabase("SELECT * FROM user")]);
            res.render("page/bxh.ejs", {
                user: await user.getInfo(),
                options,
                totalUsers: totalUsersResult[0].totalUsers,
                allUser: allUserResult,
                type: ['topsm', 'topgiauco'].includes(type) ? type : 'topsm'
            })
        } catch (err) {
            next(err)
        }
    },
};
