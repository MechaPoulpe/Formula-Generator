import React, { Component } from 'react';
import './App.css';
import Generation from './Generation.js';

class GenerationList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      socket: props.io,
      generations: []
    }

    this.addGeneration = this.addGeneration.bind(this);
    
    this.state.socket.on('result', (data) => {
      this.addGeneration(data);
    });
  };

  addGeneration (data) {
    let tmp = this.state.generations;
    tmp.push(
        <Generation key={tmp.length} data={data} />
    );
    this.setState({generations: tmp});
  };

  render () {
    return (
        <div className="GenerationList">
          {this.state.generations}
        </div>
    );
  };
}

export default GenerationList;
