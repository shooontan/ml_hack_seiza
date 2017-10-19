# -*- coding: utf-8 -*- 
# coding: UTF-8
import seiza_keras as seiza
import sys, os, json
from PIL import Image
import numpy as np
import MySQLdb
# from MySQLdb.cursors import DictCursor

# コマンドラインからファイル名を得る --- (※1)
if len(sys.argv) <= 2:
    print("gyudon-checker.py (画像パス) (ユニークid)")
    quit()

image_size = 50
categories = [
    "おひつじ座", "おうし座", "ふたご座", "かに座", "しし座", "おとめ座",
    "てんびん座", "さそり座", "いて座", "やぎ座", "みずがめ座", "うお座"]


# 入力画像をNumpyに変換 --- (※2)
X = []
files = []
# for fname in sys.argv[1:]:
#     img = Image.open(fname)
#     img = img.convert("RGB")
#     img = img.resize((image_size, image_size))
#     in_data = np.asarray(img)
#     X.append(in_data)
#     files.append(fname)
#     break

# 第一引数を取得
fname = sys.argv[1]
img = Image.open(fname)
img = img.convert("RGB")
img = img.resize((image_size, image_size))
in_data = np.asarray(img)
X.append(in_data)
files.append(fname)

X = np.array(X)

# 第二引数(ユニークid)を取得
uId = sys.argv[2]

# CNNのモデルを構築 --- (※3)
model = seiza.build_model(X.shape[1:])
model.load_weights("./seiza_model.hdf5")

# データを予測 --- (※4)
html = ""
pre = model.predict(X)

for i, p in enumerate(pre):
    y = p.argmax()
    jsonData = {
        "id": uId,
        "result": {
            "name": categories[y],
            "error": False,   
        },
    }

    # jsonのテキストに変化
    jsonText = json.dumps(jsonData, ensure_ascii = False)
    # print(jsonText)

# jsonを保存 --- (※5)
# connector = MySQLdb.connect(
#     user = 'adminuser',
#     passwd = 'password',
#     host = 'localhost',
#     db = 'ml_hack_seiza',
#     charset="utf8"
# )
connector = MySQLdb.connect(
    user = 'root',
    passwd = 'password',
    host = 'localhost',
    db = 'ml_hack_seiza',
    charset="utf8"
)


cursor = connector.cursor()
cursor.execute('INSERT INTO seiza (`img_path`, `result`) VALUES (%s, %s)', (fname, jsonText))

# 保存を実行（忘れると保存されないので注意）
connector.commit()
 
# 接続を閉じる
connector.close()

print(jsonText)

exit()
