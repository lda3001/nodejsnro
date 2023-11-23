module.exports = {
  name: "gachthe1s/webhook",
  middleware: [],
  method: "post",
  run: async ({ req, res, sql }) => {
    console.log(req.body)
    var setStatus = (code, status) => {
      global.sql.query("SELECT * FROM topup WHERE ma = ?", [code], (err, data) => {
        if (err) {
          console.log("error: " + code);
        }
        if (data.length === 0) {
          return;
        }
        global.sql.query("UPDATE topup SET trangthai = ? WHERE ma = ?", [status, code], (err, results) => {
          if (err) {
            console.log("error: " + code)
          }
          if (status == 1) {
            global.sql.query("SELECT * FROM user WHERE username = ?", [data[0].username], async (err, user) => {
              if (!user.length) return;
              if (err) {
                console.log("ERR FIND USER WEBHOOK")
              }
              const currentUser = user[0];
              const currentCoins = currentUser.vnd || 0;

              const newCoins = currentCoins + parseInt(req.body.value);
              global.sql.query("UPDATE user SET vnd = ? WHERE username = ?", [newCoins, user[0].username], (err, results) => {
                if(err){
                  console.log("ERROR ADD COINS WEBHOOK")
                }
                console.log({
                  message: "Nap tien thanh cong",
                  username: user[0].username,
                  value: req.body.value
                })
              });
            })
          }
          else {
            console.log(req.body)
          }
        })
      })
    }
    var { status, code } = req.body
    global.sql.query("SELECT * FROM topup WHERE ma = ?", [code], async (err, results) => {
      if (err) {
        console.log("Da xay ra loi : " + code);
      }
      (status == 1 || status == 2) ? setStatus(code, 1) : setStatus(code, 2)
    })
  },
};
