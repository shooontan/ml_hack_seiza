# -*- coding:utf-8 -*-
import os
import json
from PIL import Image
import numpy as np
from bottle import route, run, template
from bottle import get, post, request, response, error
import seiza_keras as seiza
import base64
import re
from io import BytesIO

categories = [
    "おひつじ座", "おうし座", "ふたご座", "かに座", "しし座", "おとめ座",
    "てんびん座", "さそり座", "いて座", "やぎ座", "みずがめ座", "うお座"]

@route('/')
def hello():
    return 'hello'


@post("/api/predict")
def predict():
    try:
        print(request.params.get('data'))
        image_data = re.sub('^data:image/.+;base64,', '', request.params.get('data'))
        img = Image.open(BytesIO(base64.b64decode(image_data)))

        X = []
        img = img.convert("RGB")
        img = img.resize((50, 50))
        in_data = np.asarray(img)
        X.append(in_data)

        X = np.array(X)

        model = seiza.build_model(X.shape[1:])
        model.load_weights("./seiza_model.hdf5")
        pre = model.predict(X)

        body = {
            "predict": 0,
            "name": ""
        }

        for i, p in enumerate(pre):
            y = p.argmax()
            body["predict"] = int(y)
            body["name"] = categories[y]

        response.headers['Access-Control-Allow-Origin'] = '*'
        return json.dumps(body)
    except ValueError:
        return 'error'


@error(404)
def error404(error):
    return 'Nothing here, sorry'

run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
