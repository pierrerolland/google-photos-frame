import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Client from '../clients/Client';
import { chunk } from 'lodash';
import '../style/pages/AlbumsPage.css';

class AlbumsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            albums: []
        };
    }

    componentWillMount() {
        Client
            .albums()
            .then(albums => this.setState({ albums }));
    }

    render() {
        return <div className="AlbumsPage">
            {chunk(this.state.albums, 2).map((albumChunk, chunkId) => (
                <div className="AlbumsPage-row">
                    {albumChunk.map((album, albumId) => (
                        <Link
                            to={`/photos/${album.id}`}
                            className="AlbumsPage-album"
                            key={`album-${chunkId}-${albumId}`}
                            style={{
                                backgroundImage: `url(${album.coverPhotoBaseUrl})`
                            }}
                        >
                            <h2>{album.title}</h2>
                        </Link>
                    ))}
                </div>
            ))}
        </div> ;
    }
}

export default AlbumsPage;
