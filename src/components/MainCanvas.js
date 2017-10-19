import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import getFileName from './FileName';

const style = {
    margin: 12,
};


export default class CanvasComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defSize: 7,
            defColor: '#fff',
            points: [], // 点の位置
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
    // shouldComponentUpdate(nextProps, nextState) {
    //     return false;
    // }

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

        this.state.points.forEach((val, ind, ar) => {
            //draw 関数にマウスの位置を渡す
            this.draw(val[0], val[1]);
        });
    }

    onClickCanvas(e) {
        const rect = e.target.getBoundingClientRect();
        const X = ~~(e.clientX - rect.left);
        const Y = ~~(e.clientY - rect.top);

        // 点の位置を保存していく
        this.state.points.push([X, Y]);

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

        this.state.points = [];

        // DataURLImg のstateを更新する
        const img = this.refs.canvas.toDataURL('image/png');
        this.props.actions.setDateURLImg(img);
    }

    render() {
        let width = 700;
        let height = 400;

        if (window.screen.width < 860) {
            width = width * window.screen.width / 860;
            height = height * window.screen.height / 860;
        }

        return (
            <div className="canvas-box">
                <div>
                    <canvas
                        ref="canvas"
                        width={width}
                        height={height}
                        onClick={this.onClickCanvas}
                    ></canvas>
                </div>
                <div className="canvas-btn-box">
                    <RaisedButton
                        label="HACK"
                        style={style}
                        onClick={this.props.actions.onClickJudgeBtn}
                        disabled={this.props.loading}
                    />
                    <RaisedButton
                        label="RESET"
                        style={style}
                        onClick={this.onClickResetBtn}
                    />
                </div>
            </div>
        )
    }
}