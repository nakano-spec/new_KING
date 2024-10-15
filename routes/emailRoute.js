const express = require('express');
const router = express.Router();
const sendmail = require('sendmail')();

router.get('/', function(req, res, next) {
    console.log("接続成功");
    console.log(req.query.email);
    // POSTリクエストからメール送信に必要な情報を取得
    const email = req.query.email;
    console.log(email);
    sendmail({
        from: 'KINGOYSTERMASHROOM@yourdomain.com',
        to: email,
        subject: "パスワード変更について",
        html: "メールが届きました",
    }, function(err, reply) {
        if (err) {
            console.log(err && err.stack);
            res.status(500).send("メール送信に失敗しました。");
        } else {
            console.dir(reply);
            res.send("メールが正常に送信されました。");
        }
    });
});

module.exports = router;
