import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import SeizaCanvas from './containers/SeizaCanvas';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <div className="bgi-container"> */}
        <div className="bgi"></div>
        {/* </div> */}
        <SeizaCanvas />
      </div>
    );
  }
}

export default hot(module)(App);
