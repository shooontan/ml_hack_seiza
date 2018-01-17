// @flow
import * as React from 'react';
import MainCanvas from '../components/MainCanvas';
import JudgeMessage from '../components/JudgeMessage';

type PropsType = {};

type StateType = {
  loading: boolean,
  message: string,
  img: ?string,
};

export default class CanvasComponent extends React.Component<PropsType, StateType> {
  state = {
    img: null,
    message: '？？？？',
    loading: false,
  };

  // 画像の判別
  onClickJudgeBtn = () => {
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
    })
      .then(response => response.json())
      .then((payload) => {
        // 星座名を取得
        const name = payload.result.name || '';
        this.setMassage(name);

        // 判別終了
        this.setState({
          loading: false,
        });
      })
      .catch(() => {
        this.setMassage('ERROR');

        // 判別終了
        this.setState({
          loading: false,
        });
      });
  };

  // DateURL画像のテキストをセット
  setDateURLImg = (DataUrl: string) => {
    this.setState({
      img: DataUrl,
    });
  };

  // メッセージを表示する
  setMassage = (text: string) => {
    this.setState({
      message: text,
    });
  };

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
        <MainCanvas actions={actions} loading={this.state.loading} />
        <JudgeMessage loading={this.state.loading} message={this.state.message} />
      </div>
    );
  }
}
