const fs = require('fs');
const express = require('express');
const router = express.Router();
const mysql = require("mysql");
const crypto = require('crypto');

// ユニークid
let uId = '';
let postImgPath = '';

// apiで表示するデータ
let jsonResult = '';

// ファイルの存在を確認する
const isExistFile = (file) => {
    try {
        fs.statSync(file);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        }
    }

    return true;
}

// 乱数を取得
const getUniqueStr = (myStrong) => {
    const strong = 1000;
    if (myStrong) {
        strong = myStrong;
    }
    return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16)
}


// 文字列ハッシュ化
const mkhash = (str) => {
    const hash = crypto.createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
}

// 画像をダウンロードしてパスを返す
const saveImg = (data) => {
    // dataURL
    if (/^data:image\/(jpeg|png);base64,/.test(data)) {
        const imgData = data.replace(/^data:image\/(jpeg|png);base64,/, '');

        // 画像の拡張子
        const imgType = (data.match(/^data:image\/(jpeg|png);base64,/))[1];
        // 画像のファイル名
        const imgPath = `./data/post/${mkhash(data)}.${imgType}`;
        console.log(imgPath);

        fs.writeFileSync(imgPath, imgData, 'base64');
        return imgPath;
    }
}

// pythonコマンドを叩く
const executePython = (req, res, next) => {
    // postデータから画像を取得
    const dataURL = req.body.image;
    // postされた画像パス
    postImgPath = saveImg(dataURL);

    console.log(postImgPath)

    // ユニークidを取得
    // uId = req.body.id;
    uId = getUniqueStr();
    // console.log(uId)

    const exec = require('child_process').exec;
    exec(`python3 seiza_checker.py ${postImgPath} ${uId}`, (err, stdout, stderr) => {
        next();
    });
}
router.use(executePython);


// ユニークidのjsonファイルを読み込む
const readJsonData = (req, res, next) => {
    // const fileName = `./json/${uId}.json`;
    // console.log(fileName)

    // db接続
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'ml_hack_seiza'
    });
    connection.connect();
    const sql = `SELECT * FROM seiza WHERE img_path = '${postImgPath}' LIMIT 1`;
    console.log(sql);
    connection.query(sql, (err, rows, fields) => {
        if (err) {
            throw err;
        }
        // console.log(rows);
        let result = rows[0].result;
        jsonResult = JSON.parse(result);
        next();
    });
    connection.end();
}
router.use(readJsonData);


/* GET users listing. */
router.post('/', (req, res, next) => {
    // json で表示する
    res.charset = 'utf-8';
    res.json(jsonResult);
});

module.exports = router;