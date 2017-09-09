const fs = require('fs');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {

    // ファイルを読み込む
    fs.readFile(__dirname + '/../views/index.html', (err, data) => {
        // ヘッダー直書き
        res.writeHeader(200, {
            'Content-Type': 'text'
        });

        // 本文を書き込む
        res.write(data);

        // データの通信の終了
        res.end();
    });
});

module.exports = router;
