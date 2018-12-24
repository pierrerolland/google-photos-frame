const fs = require('fs');
const fetch = require('node-fetch');
const { google } = require('googleapis');
const credentials = require('../conf/credentials');

module.exports = new class {
    constructor() {
        this.client = null;
        this.credentials = null;
    }

    getClient() {
        if (!this.client) {
            this.client = new google.auth.OAuth2(
                credentials.web.client_id,
                credentials.web.client_secret,
                credentials.web.redirect_uris[0]
            );
        }

        return this.client;
    };

    getAuthUrl() {
        return this.getClient().generateAuthUrl({
            scope: [
                'https://www.googleapis.com/auth/photoslibrary.readonly'
            ]
        });
    }

    async authenticate(code) {
        const { tokens } = await this.getClient().getToken(code);

        fs.writeFile(`${__dirname}/../conf/access.json`, JSON.stringify(tokens));

        return tokens;
    }

    async grabAlbums() {
        const access = JSON.parse(fs.readFileSync(`${__dirname}/../conf/access.json`));
        const albums = await (await fetch('https://photoslibrary.googleapis.com/v1/sharedAlbums', {
            headers: {
                'Authorization': `Bearer ${access.access_token}`
            }
        })).json();

        if (!albums.error) {
            fs.writeFile(`${__dirname}/../conf/albums.json`, JSON.stringify(albums.sharedAlbums));
        }
    }

    photos() {
        return require('../conf/photos');
    }

    selectAlbum(albumId) {
        let photos = require('../conf/photos');

        if (!fs.existsSync(`${__dirname}/../photos/${albumId}`)) {
            fs.mkdirSync(`${__dirname}/../photos/${albumId}`);
        }
        fs.writeFileSync(`${__dirname}/../conf/current-album.json`, JSON.stringify({
            albumId
        }));

        if (!photos[albumId]) {
            photos[albumId] = {
                photos: [],
                lastPageToken: null,
                date: null
            };

            fs.writeFileSync(`${__dirname}/../conf/photos.json`, JSON.stringify(photos));
        }
    }

    async grabPhotos() {
        const {albumId}  = require('../conf/current-album');
        const access = require(`${__dirname}/../conf/access`);
        let allPhotos = require('../conf/photos');
        const alreadyExistingPhotos = allPhotos[albumId];

        let photosCollection = [];
        let nextPageToken = alreadyExistingPhotos.lastPageToken;
        let lastPageToken = null;

        while (typeof nextPageToken !== 'undefined') {
            const body = {
                albumId,
                pageSize: 100
            };

            if (nextPageToken) {
                body.pageToken = nextPageToken;
            }

            const album = await (await fetch(`https://photoslibrary.googleapis.com/v1/mediaItems:search`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Authorization': `Bearer ${access.access_token}`,
                    'Content-type': 'application/json'
                }
            })).json();

            if (album.error) {
                console.log('Error while fetching pictures', album.error);
                break;
            }

            const items = album.mediaItems.map(item => ({
                id: item.id,
                creationDate: item.mediaMetadata.creationTime,
                baseUrl: item.baseUrl,
                received: false
            }));

            photosCollection = photosCollection.concat(items);

            if (!album.nextPageToken) {
                lastPageToken = nextPageToken;
            }

            nextPageToken = album.nextPageToken;
        }

        photosCollection.filter(photo =>
            typeof alreadyExistingPhotos.photos.find(a => a.id === photo.id) === 'undefined');

        photosCollection.sort((a, b) => {
            if (a.creationDate === b.creationDate) {
                return 0;
            }

            return a.creationDate < b.creationDate ? -1 : 1;
        });

        const toWrite = alreadyExistingPhotos.photos.concat(photosCollection);
        const toProcess = toWrite.filter(photo => !photo.received);
        let processed = [];

        Promise.all(toProcess.map(photo => fetch(photo.baseUrl).then(res => {
                    const dest = fs.createWriteStream(`${__dirname}/../photos/${albumId}/${photo.id}`, {
                        autoClose: true
                    });
                    res.body.pipe(dest);
                    processed.push({...photo, received: true});
                })).map(p => p.catch(() => undefined)))
            .then(() => {
                    processed.forEach(p => {
                    toWrite.find(w => p.id === w.id).received = true;
                });

                allPhotos[albumId] = {
                    date: photosCollection[photosCollection.length - 1].creationDate,
                    lastPageToken,
                    photos: toWrite
                };
                fs.writeFile(`${__dirname}/../conf/photos.json`, JSON.stringify(allPhotos));
            });
    }
};
