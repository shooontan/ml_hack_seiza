// @floq
import * as React from 'react';
import ndarray from 'ndarray';
import ops from 'ndarray-ops';
import RaisedButton from 'material-ui/RaisedButton';
import model from '../keras';

const style = {
  margin: 12,
};

type PropsType = {
  loading: boolean,
  actions: {
    setDateURLImg: Function,
    setMassage: Function,
    onClickJudgeBtn: Function,
  },
};

type StateType = {
  refs: {
    canvas: React.Element<'canvas'>,
  },
};

export default class CanvasComponent extends React.Component<PropsType, StateType> {
  state = {
    defSize: 7,
    defColor: '#fff',
    points: [], // 点の位置
  };

  componentDidMount() {
    this.updateCanvas();

    // DataURLImg のstateを更新する
    const img = this.canvas.toDataURL('image/png');
    this.props.actions.setDateURLImg(img);
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  onClickCanvas = (e) => {
    const rect = e.target.getBoundingClientRect();
    const X = Math.floor(e.clientX - rect.left);
    const Y = Math.floor(e.clientY - rect.top);

    // 点の位置を保存していく
    this.state.points.push([X, Y]);

    // DataURLImg のstateを更新する
    const img = this.canvas.toDataURL('image/png');
    this.props.actions.setDateURLImg(img);
  };

  onClickResetBtn = () => {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = '#333';
    ctx.globalAlpha = 1.0;
    ctx.fillRect(0, 0, 700, 400);

    this.state.points = [];

    // DataURLImg のstateを更新する
    const img = this.canvas.toDataURL('image/png');
    this.props.actions.setDateURLImg(img);
  };

  updateCanvas = () => {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, 700, 400);
    // this.props.updateCanvas(context);

    this.state.points.forEach((val) => {
      // draw 関数にマウスの位置を渡す
      this.draw(val[0], val[1]);
    });

    // ここから
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    const { data, width, height } = imageData;
    // data processing
    // see https://github.com/keras-team/keras/blob/master/keras/applications/imagenet_utils.py
    const dataTensor = ndarray(new Float32Array(data), [width, height, 4]);
    const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [width, height, 3]);

    ops.divseq(dataTensor, 127.5);
    ops.subseq(dataTensor, 1);
    ops.assign(dataProcessedTensor.pick(null, null, 0), dataTensor.pick(null, null, 0));
    ops.assign(dataProcessedTensor.pick(null, null, 1), dataTensor.pick(null, null, 1));
    ops.assign(dataProcessedTensor.pick(null, null, 2), dataTensor.pick(null, null, 2));

    const preprocessedData = dataProcessedTensor.data;

    // console.log('====================================');
    // console.log(imageData);
    // console.log('====================================');

    // console.log('====================================');
    // console.log(preprocessedData);
    // console.log('====================================');

    const inputName = model.inputLayerNames[0];
    const outputName = model.outputLayerNames[0];
    const inputData = { [inputName]: preprocessedData };

    console.log('====================================');
    console.log(inputName);
    console.log(outputName);
    console.log(inputData);
    console.log('====================================');

    model
      .predict(inputData)
      .then((outputData) => {
        console.log('====================================');
        console.log(outputData);
        console.log('====================================');
        // this.inferenceTime = this.model.predictStats.forwardPass;
        // this.output = outputData[outputName];
        // this.modelRunning = false;
        // this.updateVis(this.outputClasses[0].index);
      })
      .catch((error) => {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
      });
  };

  draw = (x, y) => {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();

    ctx.lineTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineWidth = this.state.defSize * 2;
    ctx.strokeStyle = this.state.defColor;
    // ctx.beginPath();
    // ctx.arc(70, 70, 60, 10 * Math.PI / 180, 80 * Math.PI / 180, true);
    ctx.stroke();
  };

  render() {
    let width = 700;
    let height = 400;
    const max = 860;

    if (window.screen.width < max) {
      width *= window.screen.width;
      width /= max;
      height *= window.screen.height;
      height /= max;
    }

    return (
      <div className="canvas-box">
        <div>
          <canvas
            ref={(ref) => {
              this.canvas = ref;
            }}
            width={width}
            height={height}
            onClick={this.onClickCanvas}
          />
        </div>
        <div className="canvas-btn-box">
          <RaisedButton
            label="HACK"
            style={style}
            onClick={this.props.actions.onClickJudgeBtn}
            disabled={this.props.loading}
          />
          <RaisedButton label="RESET" style={style} onClick={this.onClickResetBtn} />
        </div>
      </div>
    );
  }
}
