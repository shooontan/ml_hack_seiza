// @flow
import * as React from 'react';
import { hot } from 'react-hot-loader';
import SeizaCanvas from './containers/SeizaCanvas';

function App() {
  return (
    <div className="App">
      <div className="bgi" />
      <SeizaCanvas />
    </div>
  );
}

export default hot(module)(App);
