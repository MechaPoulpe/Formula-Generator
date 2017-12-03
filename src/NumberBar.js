import React, { Component } from 'react';
import { Button, FormControl, ControlLabel } from 'react-bootstrap';
import './App.css';

class NumberBar extends Component {

  constructor (props) {
    super(props);
    this.state = {
      socket: props.io,
      number: '',
      disabled: false
    };
    this.setNumber = this.setNumber.bind(this);
    this.allowNumberOnly = this.allowNumberOnly.bind(this);
    this.sendSocketData = this.sendSocketData.bind(this);

    //Enable on result or error
    this.state.socket.on('result', () => {
      this.setState({disabled: false, number: ''})
    });

    this.state.socket.on('err', () => {
      this.setState({disabled: false})
    });
  }

  allowNumberOnly (e) {
    let cc = e.charCode;
    if (cc < 48 || cc > 57) {
      e.preventDefault();
    }

    if (cc === 13){
      this.sendSocketData();
    }
  };

  setNumber (e) {
    this.setState({
      number: e.target.value
    });
  };

  sendSocketData () {
    let data = this.state.number;
    if (data === '') {
      return;
    }
    this.state.socket.emit('data', Number(data));
    this.setState({disabled: true});
  };

  render () {
    return (
      <div>
        <ControlLabel
          htmlFor="numberInput"
          className="NumberBarLabel">
            For now the limit is 48 bits
        </ControlLabel>
        <div className="NumberBar">
          <FormControl
            onKeyPress={this.allowNumberOnly}
            onChange={this.setNumber}
            id="numberInput"
            type="text"
            label="Text"
            placeholder="Number: 12345"
            className="NumberBarInput"
            disabled={this.state.disabled}
            value={this.state.number}
          />
          <Button 
            bsStyle="primary"
            className="NumberBarButton"
            disabled={this.state.disabled}
            onClick={this.sendSocketData}>
              Find
          </Button>
        </div>
      </div>
    );
  }
}

export default NumberBar;
