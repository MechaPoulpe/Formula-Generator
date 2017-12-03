import React, { Component } from 'react';
import './App.css';

import config from './config.js';
import io from 'socket.io-client';

import Header from './Header.js';
import NumberBar from './NumberBar.js';
import GenerationList from './GenerationList.js';
import AlertBox from './components/AlertBox.js';

class App extends Component {
  constructor () {
    super();
    this.state = {
      io: io(config.urlNode),
      message: null
    }

    this.state.io.on('err', (data) => {
      this.setState({message: data})
    });
  };

  render () {
    return (
      <div className="App">
        <Header />
        <AlertBox message={this.state.message} />
        <NumberBar io={this.state.io} />
        <GenerationList io={this.state.io} />
      </div>
    );
  }
}

export default App;
