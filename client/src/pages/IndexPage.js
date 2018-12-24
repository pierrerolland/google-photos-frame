import React, { Component } from 'react';
import GoogleLoginButton from '../components/buttons/GoogleLoginButton';
import '../style/pages/IndexPage.css';

class IndexPage extends Component {
    render() {
        return (
            <div className="IndexPage">
                <GoogleLoginButton />
            </div>
        );
    }
}

export default IndexPage;
