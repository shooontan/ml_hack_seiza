import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import SeizaCanvas from './containers/SeizaCanvas';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src="/images/logo.svg" className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <SeizaCanvas />
      </div>
    );
  }
}

export default App;
