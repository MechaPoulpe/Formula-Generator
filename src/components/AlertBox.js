import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class AlertBox extends Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: false,
            message: null
        }
        this.dismissAlert = this.dismissAlert.bind(this);
        this.showAlert = this.showAlert.bind(this);
    };

    componentWillReceiveProps (nextProps) {
        if (this.state.message !== nextProps.message) {
            this.showAlert(nextProps.message);
        } 
    }

    dismissAlert () {
        this.setState({ visible: false, message: null });
    };

    showAlert (message) {
        this.setState({ visible: true, message: message });
    };

    render () {
        return (
            this.state.visible &&
            <Alert bsStyle="danger" onDismiss={this.dismissAlert}>
                <p>{this.state.message}</p>
            </Alert>
        );
    }
}

export default AlertBox;
