var crypto = require("crypto");
var axios = require("axios")
var config = require("../../config")
var { isLogin } = require("../../middleware/auth.middleware")

module.exports = {
    name: "gachthe1s/guithe",
    middleware: [isLogin],
    method: "post",
    run: async ({ req, res, user }) => {
        try {
            var { serial, code, amount, telco } = req.body;
            console.log(req.body)
            if (!serial || !code || !amount || !telco) {
                return res.json({
                    error: true,
                    message: "Invaild Params"
                })
            }
            var user = await user.getInfo();
            if (!user.length) {
                res.redirect("/login")
            }
            const hash = crypto.createHash("md5").update(config.thesieure.partner_key + code + serial).digest("hex");
            var requestID = Math.random() * (999999999 - 10000000) + 10000000
            var form = {
                request_id: requestID,
                telco,
                code,
                serial,
                amount,
                partner_id: config.thesieure.partner_id,
                sign: hash,
                command: 'charging'
            }
            axios({
                method: "POST",
                url: "https://gachthe1s.com/chargingws/v2",
                data: form,
                headers: {
                    'content-type': 'application/json'
                }
            }).then(body => {
                console.log(body)
                var status = [
                    {
                        status: "PENDING",
                        message: "Gửi thẻ thành công, đợi duyệt!",
                        error: false
                    },
                    {
                        status: "charging.invalid_card_code",
                        message: "Mã thẻ không hợp lệ!",
                        error: true
                    },
                    {
                        status: "charging.card_existed",
                        message: "Thẻ đã tồn tại trên hệ thống!",
                        error: true
                    }
                ]
                var data = status.find(i => i.status == body.data.message);
                if (data.status == "PENDING") {
                    const insertUserQuery = `INSERT INTO topup (trangthai, vnd, username, request_id, seri, ma) VALUES (?, ?, ?, ?, ?, ?)`;
                    global.sql.query(insertUserQuery, [0, amount, user[0].username, requestID, serial, code], (updateErr) => {
                        if (updateErr) {
                            console.error("Lỗi khi them the cao:", updateErr);
                            return res.json({
                                error: true,
                                message: "Lỗi khi thêm thẻ cào",
                            });
                        }
                    })
                }
                return res.json({
                    error: data.error,
                    message: data.message
                })
            }).catch(err => {
                console.log(err);
                return res.json({
                    error: true,
                    message: "Đã xảy ra lỗi tại hệ thống!",
                });
            })
        } catch (err) {
            console.log(err);
            return res.json({
                error: true,
                message: "Đã xảy ra lỗi tại hệ thống!",
            });
        }
    }
};
