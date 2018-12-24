import config from '../config.json';

class Client {
    fetch(uri, method, body) {
        return fetch(`${config.api}/${uri}`, {
            method,
            body: body ? JSON.stringify(body) : null,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => response.ok ?
            (response.status !== 204 ? response.json() : Promise.resolve()) :
            Promise.reject(response)
        );
    }

    get(uri) {
        return this.fetch(uri, 'GET');
    }

    post(uri, body) {
        return this.fetch(uri, 'POST', body);
    }

    getAuthUrl() {
        return this.get('auth-url');
    }

    confirmAuth(code) {
        return this.post('authenticate', { code });
    }

    albums() {
        return this.get('albums');
    }

    photos(albumId) {
        return this.post('photos', { albumId });
    }

    photoUrl(photoId) {
        return `${config.api}/photo?photoId=${photoId}`;
    }
}

export default new Client();
