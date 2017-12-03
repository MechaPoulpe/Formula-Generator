import React, { Component } from 'react';
import { Panel, Badge } from 'react-bootstrap';
import './App.css';

class Generation extends Component {
  constructor (props) {
    super(props);
    this.state = {
      formula: props.data.formula,
      number: props.data.number,
      nbIteration: props.data.nbIteration
    };
  };

  render () {
    return (
      <Panel header={<Badge>{this.state.number}</Badge>} className="Generation" bsStyle="primary">
          <span className="GenerationLabel">Formula</span>
          <h5><strong>{this.state.formula}</strong></h5>
          <span className="GenerationLabel">Number of iteration</span>
          <h5><strong>{this.state.nbIteration}</strong></h5>
        </Panel>
    );
  };
}

export default Generation;
