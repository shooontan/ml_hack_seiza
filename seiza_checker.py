# -*- coding: utf-8 -*-
# coding: UTF-8
import seiza_keras as seiza
import sys, os, json
from PIL import Image
import numpy as np
import sys

# コマンドラインからファイル名を得る --- (※1)
if len(sys.argv) <= 1:
    print("seiza-checker.py (画像パス) (ユニークid)")
    quit()

image_size = 50
categories = [
    "おひつじ座", "おうし座", "ふたご座", "かに座", "しし座", "おとめ座",
    "てんびん座", "さそり座", "いて座", "やぎ座", "みずがめ座", "うお座"]


# 入力画像をNumpyに変換 --- (※2)
X = []
files = []
for fname in sys.argv[1:]:
    img = Image.open(fname)
    img = img.convert("RGB")
    img = img.resize((image_size, image_size))
    in_data = np.asarray(img)
    X.append(in_data)
    files.append(fname)
    print(fname)
    break

X = np.array(X)

print(X)
print(X.shape)
print(X.shape[1:])

# CNNのモデルを構築 --- (※3)
model = seiza.build_model(X.shape[1:])
model.load_weights("./seiza_model.hdf5")

# データを予測 --- (※4)
html = ""
pre = model.predict(X)

print(pre)

for i, p in enumerate(pre):
    y = p.argmax()
    print("+ 入力:", files[i])
    print("| 星座名:", categories[y])



def checker(image):
    X = []
    img = Image.open(image)
    img = img.convert("RGB")
    img = img.resize((image_size, image_size))
    in_data = np.asarray(img)
    X.append(in_data)

    X = np.array(X)

    model = seiza.build_model(X.shape[1:])
    model.load_weights("./seiza_model.hdf5")

    pre = model.predict(X)
    return pre
