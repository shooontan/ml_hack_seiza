import React, { Component } from 'react';
import getFileName from '../components/FileName';
import MainCanvas from '../components/MainCanvas';
import SeizaPoint from '../components/SeizaPoint';

export default class CanvasComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            point: 0,
            img: null,
        }
        this.onClickJudgeBtn = this.onClickJudgeBtn.bind(this);
        this.onClickResetBtn = this.onClickResetBtn.bind(this);
        this.setDateURLImg = this.setDateURLImg.bind(this);
        this.countUp = this.countUp.bind(this);
        this.countClear = this.countClear.bind(this);
    }

    // canvs画像のダウンロード
    onClickJudgeBtn() {
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
        }).catch(error => {
            console.log(error);
        })
    }

    // キャンバスリセット
    onClickResetBtn() {
        console.log("aaaaa")
    }

    // ポイントのカウントアップ
    countUp() {
        this.setState({
            point: this.state.point + 1,
        });
    }

    countClear() {
        this.setState({
            point: 0,
        });
    }

    // DateURL画像のテキストをセット
    setDateURLImg(DataUrl) {
        this.setState({
            img: DataUrl,
        });
    }

    render() {
        const actions = {
            countUp: this.countUp,
            countClear: this.countClear,
            setDateURLImg: this.setDateURLImg
        };

        return (
            <div>
                <MainCanvas
                    point={this.state.point}
                    actions={actions}
                />
                <SeizaPoint
                    point={this.state.point}
                />
                <button
                    onClick={this.onClickJudgeBtn}
                >判別</button>
            </div>

        )
    }
}