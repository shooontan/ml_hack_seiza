// @flow
import * as React from 'react';
import { hot } from 'react-hot-loader';
import CircularProgress from 'material-ui/CircularProgress';
import SeizaCanvas from './components/SeizaCanvas';
import sleep from './libs/sleep';

type State = {
  loading: boolean,
  message: string,
};

class App extends React.Component<{}, State> {
  state = {
    message: '？？？？',
    loading: false,
  };

  // 画像の判別
  onClickJudgeBtn = async (canvas: HTMLCanvasElement) => {
    // 判別開始
    this.setState({
      loading: true,
    });

    try {
      const ctx = canvas.getContext('2d');

      const canvas2 = document.createElement('canvas');
      const ctx2 = canvas2.getContext('2d');
      const resizeSize = 50;

      canvas2.width = resizeSize;
      canvas2.height = resizeSize;
      ctx2.drawImage(
        canvas,
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height,
        0,
        0,
        resizeSize,
        resizeSize,
      );

      const formData = new FormData();
      formData.append('data', canvas2.toDataURL());

      const request = {
        method: 'POST',
        body: formData,
      };

      const response = await Promise.all([
        fetch('https://mlhackseiza.herokuapp.com/api/predict', request),
        sleep(4000),
      ]);

      if (response[0].ok) {
        const { name }: { predict: number, name: string } = await response[0].json();
        this.setMassage(name);
      } else {
        throw new Error(response[0].status);
      }
    } catch (error) {
      this.setMassage('ERROR');
    } finally {
      // 判別終了
      this.setState({
        loading: false,
      });
    }
  };

  // メッセージを表示する
  setMassage = (text: string) => {
    this.setState({
      message: text,
    });
  };

  render() {
    const actions = {
      setMassage: this.setMassage,
      onClickJudgeBtn: this.onClickJudgeBtn,
    };

    return (
      <div className="App">
        <div className="bgi" />
        <div>
          <div className="head-box">
            <p>SEP 9 - 10, 2017</p>
            <p>TEAM SEIZA, CHOFU, TK</p>
          </div>
          <SeizaCanvas actions={actions} loading={this.state.loading} />
          <div className="judge-box">
            {this.state.loading ? <CircularProgress /> : <p>{this.state.message}</p>}
          </div>
        </div>
      </div>
    );
  }
}

export default hot(module)(App);
