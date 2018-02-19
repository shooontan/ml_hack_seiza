// @flow
import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};

type PropsType = {
  loading: boolean,
  actions: {
    setMassage: Function,
    onClickJudgeBtn: Function,
  },
};

type StateType = {
  defSize: number,
  defColor: string,
  points: Array<[number, number]>,
  scanner: number,
  accela: number,
};

export default class SeizaCanvas extends React.Component<PropsType, StateType> {
  state = {
    defSize: 7,
    defColor: '#fff',
    points: [],
    scanner: 0,
    accela: 3,
  };

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  onClickCanvas = (e: Event) => {
    const { target } = e;
    if (target instanceof HTMLCanvasElement) {
      const rect = target.getBoundingClientRect();

      if (
        e.clientX &&
        e.clientY &&
        typeof e.clientX === 'number' &&
        typeof e.clientY === 'number'
      ) {
        const X = e.clientX - rect.left;
        const Y = e.clientY - rect.top;

        // 点の位置を保存していく
        this.state.points.push([X, Y]);

        this.updateCanvas();
      }
    }
  };

  onClickResetBtn = () => {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = '#333';
    ctx.globalAlpha = 1.0;
    ctx.fillRect(0, 0, 700, 400);

    this.state.points = [];
  };

  updateCanvas = () => {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, 700, 400);

    this.state.points.forEach((val) => {
      this.draw(val[0], val[1]);
    });

    if (this.props.loading) {
      ctx.fillStyle = '#f6f7fb';
      ctx.shadowColor = '#36d2fe';
      ctx.shadowBlur = 30;
      ctx.fillRect(this.state.scanner, 0, 3, canvas.height);
    } else {
      ctx.shadowBlur = 0;
    }
  };

  draw = (x: number, y: number) => {
    const { canvas } = this;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();

    ctx.lineTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineWidth = this.state.defSize * 2;
    ctx.strokeStyle = this.state.defColor;
    ctx.stroke();
  };

  animation = () => {
    if (this.state.scanner > this.canvas.width) {
      this.setState({
        accela: this.state.accela * -1,
      });
    } else if (this.state.scanner < 0) {
      this.setState({
        accela: this.state.accela * -1,
      });
    }

    this.setState({
      scanner: this.state.scanner + this.state.accela,
    });

    this.updateCanvas();

    if (this.props.loading) {
      window.requestAnimationFrame(this.animation);
    } else {
      this.setState({
        scanner: 0,
      });
    }
  };

  hack = () => {
    window.requestAnimationFrame(this.animation);
    this.props.actions.onClickJudgeBtn(this.canvas);
  };

  canvas: HTMLCanvasElement;

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
              if (ref) {
                this.canvas = ref;
              }
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
            onClick={this.hack}
            disabled={this.props.loading}
          />
          <RaisedButton label="RESET" style={style} onClick={this.onClickResetBtn} />
        </div>
      </div>
    );
  }
}
