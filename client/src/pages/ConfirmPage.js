import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Client from '../clients/Client';
import queryString from 'query-string';

class ConfirmPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: 'pending'
        };
    }

    componentWillMount() {
        Client
            .confirmAuth(queryString.parse(this.props.location.search).code)
            .then(() => this.setState({ status: 'ok' }));
    }

    render() {
        if (this.state.pending) {
            return null;
        }

        return <Redirect to="/albums" /> ;
    }
}

export default ConfirmPage;
