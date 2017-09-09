import React, { Component } from 'react';
import getFileName from './FileName';

export default class CanvasComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defSize: 7,
            defColor: '#fff',
            point: 0,
        }
        this.draw = this.draw.bind(this);
        this.onClickCanvas = this.onClickCanvas.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
        this.onClickResetBtn = this.onClickResetBtn.bind(this);
    }

    componentDidMount() {
        this.updateCanvas();

        // DataURLImg のstateを更新する
        const img = this.refs.canvas.toDataURL('image/png');
        this.props.actions.setDateURLImg(img);
    }

    // canvas のリセットを防ぐ
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    updateCanvas() {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = "#333";
        ctx.fillRect(0, 0, 700, 400);
        // this.props.updateCanvas(context);
    }

    onClickCanvas(e) {
        const rect = e.target.getBoundingClientRect();
        const X = ~~(e.clientX - rect.left);
        const Y = ~~(e.clientY - rect.top);

        //draw 関数にマウスの位置を渡す
        this.draw(X, Y);

        // ポイントのカウントアップ
        this.props.actions.countUp();

        // DataURLImg のstateを更新する
        const img = this.refs.canvas.toDataURL('image/png');
        this.props.actions.setDateURLImg(img);
    }

    draw(x, y) {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');

        ctx.beginPath();

        ctx.lineTo(x, y);
        ctx.lineCap = 'round';
        ctx.lineWidth = this.state.defSize * 2;
        ctx.strokeStyle = this.state.defColor;
        // ctx.beginPath();
        // ctx.arc(70, 70, 60, 10 * Math.PI / 180, 80 * Math.PI / 180, true);
        ctx.stroke();
    }

    onClickResetBtn() {
        console.log("reset")
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = "#333";
        ctx.globalAlpha = 1.0;
        ctx.fillRect(0, 0, 700, 400);

        this.props.actions.countClear();
    }

    render() {
        let width = 700;
        let height = 400;

        if (window.screen.width < 860) {
            width = width * window.screen.width / 860;
            height = height * window.screen.height / 860;
        }

        return (
            <div>
                <canvas
                    ref="canvas"
                    width={width}
                    height={height}
                    onClick={this.onClickCanvas}
                ></canvas>
                <button
                    onClick={this.onClickResetBtn}
                >リセット</button>
            </div>
        )
    }
}