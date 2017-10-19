import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import getFileName from '../components/FileName';
import MainCanvas from '../components/MainCanvas';
import SeizaPoint from '../components/SeizaPoint';
import JudgeMessage from '../components/JudgeMessage';

// const style = {
//     margin: 12,
// };

export default class CanvasComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: null, // dataURLImage
            message: '？？？？', // 結果の内容
            loading: false, // 判別中
        }
        this.onClickJudgeBtn = this.onClickJudgeBtn.bind(this);
        this.setDateURLImg = this.setDateURLImg.bind(this);
        this.setMassage = this.setMassage.bind(this);
    }

    // 画像の判別
    onClickJudgeBtn() {
        console.log("aa")
        // 判別開始
        this.setState({
            loading: true,
        });

        const data = {
            image: this.state.img,
        };

        fetch('/api/seiza', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            return response.json();
        }).then(payload => {
            console.log(payload);

            // 星座名を取得
            const name = payload.result.name || '';
            this.setMassage(name);

            // 判別終了
            this.setState({
                loading: false,
            });
        }).catch(error => {
            console.log(error);
            this.setMassage('ERROR');

            // 判別終了
            this.setState({
                loading: false,
            });
        })
    }

    // DateURL画像のテキストをセット
    setDateURLImg(DataUrl) {
        this.setState({
            img: DataUrl,
        });
    }

    // メッセージを表示する
    setMassage(text) {
        this.setState({
            message: text,
        });
    }

    render() {
        const actions = {
            setDateURLImg: this.setDateURLImg,
            setMassage: this.setMassage,
            onClickJudgeBtn: this.onClickJudgeBtn,
        };

        return (
            <div>
                <div className="head-box">
                    <p>SEP 9 - 10, 2017</p>
                    <p>TEAM SEIZA, CHOFU, TK</p>
                </div>
                <MainCanvas
                    actions={actions}
                    loading={this.state.loading}
                />
                <JudgeMessage
                    loading={this.state.loading}
                    message={this.state.message}
                />
            </div>
        )
    }
}