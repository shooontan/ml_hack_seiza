from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D
from keras.layers import Activation, Dropout, Flatten, Dense
from keras.utils import np_utils
from keras.optimizers import Adagrad
from keras.optimizers import Adam
import numpy as np

# 分類対象のカテゴリ
root_dir = "../data/train/"
categories = [
    "ohituzi", "ousi", "hutago", "kani", "sisi", "otome",
    "tenbin", "sasori", "ite", "yagi", "mizugame", "uo"]
nb_classes = len(categories)
image_size = 50

# データをロード
def main():
    X_train, X_test, y_train, y_test = np.load("./seiza.npy")
    # データを正規化する
    X_train = X_train.astype("float") / 256
    X_test  = X_test.astype("float")  / 256
    y_train = np_utils.to_categorical(y_train, nb_classes)
    y_test  = np_utils.to_categorical(y_test, nb_classes)
    # モデルを訓練し評価する
    model = model_train(X_train, y_train)
    model_eval(model, X_test, y_test)

# モデルを構築
def build_model(in_shape):
    # print(in_shape)
    model = Sequential()
    model.add(Conv2D(32, 3, 3, border_mode='same', input_shape=in_shape))
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))
    model.add(Conv2D(64, 3, 3, border_mode='same'))
    model.add(Activation('relu'))
    model.add(Conv2D(64, 3, 3))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))
    model.add(Flatten())
    model.add(Dense(512))
    model.add(Activation('relu'))
    model.add(Dropout(0.5))
    model.add(Dense(nb_classes))
    model.add(Activation('softmax'))
    model.compile(loss='binary_crossentropy', optimizer='rmsprop', metrics=['accuracy'])
    return model

# モデルを訓練する
def model_train(X, y):
    model = build_model(X.shape[1:])
    model.fit(X, y, batch_size=32, epochs=10)
    # モデルを保存する
    # hdf5_file = "./seiza_model.hdf5"
    # model.save_weights(hdf5_file)
    hdf5_file = "./seiza_model.h5"
    model.save(hdf5_file)
    return model

# モデルを評価する
def model_eval(model, X, y):
    score = model.evaluate(X, y)
    print('loss=', score[0])
    print('accuracy=', score[1])

if __name__ == "__main__":
    main()
