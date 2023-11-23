module.exports = async (req, res, next) => {
  var getInfo = () => {
    try {
      return new Promise((resolve, _) => {
        var username = req.cookies?.username;
        global.sql.query("SELECT * FROM user WHERE username = ?", [username], (err, results) => {
          if (err) {
            console.error("Lỗi khi kiểm tra user:", err);
            resolve({
              error: true,
              message: "Lỗi khi kiểm tra user",
            });
          }
          resolve(results);
        });
      });
    } catch (err) {
      console.log(err);
      resolve({
        error: true,
        message: "Lỗi khi kiểm tra user",
      });
    }
  };
  return {
    getInfo
  };
};
