import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import Client from '../../clients/Client';
import '../../style/components/GoogleLoginButton.css';

class GoogleLoginButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'authUrl': ''
        };
    }

    componentWillMount() {
        Client.getAuthUrl().then(data => {
            this.setState({ authUrl: data.authUrl });
        });
    }

    render() {
        return (
            <a
                href={this.state.authUrl}
                className="GoogleLoginButton"
                onClick={this.props.onClick}
            >
                <FontAwesomeIcon icon={faSignInAlt}/> Se connecter
            </a>
        );
    }
}

export default GoogleLoginButton;
