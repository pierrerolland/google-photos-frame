import React, { Component } from 'react';
import Client from '../clients/Client';
import '../style/pages/PhotosPage.css';

class PhotosPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            photos: [],
            currentIndex: null
        };
    }

    componentWillMount() {
        Client
            .photos(this.props.match.params.albumId)
            .then(photos => {
                setInterval(() => {
                    this.setState({
                        currentIndex: this.state.currentIndex === this.state.photos.length - 1 ?
                            0 : this.state.currentIndex + 1
                    });
                }, 7000);
                this.setState({ photos, currentIndex: 0 })
            });
    }

    render() {
        if (null === this.state.currentIndex) {
            return null;
        }

        return <div className="PhotosPage">
            <img src={Client.photoUrl(this.state.photos[this.state.currentIndex].id)} />
        </div> ;
    }
}

export default PhotosPage;
