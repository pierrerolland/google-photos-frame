const google = require('../helpers/google');

module.exports = {
    method: 'POST',
    path: '/api/photos',
    handler: async (request, h) => {
        google.selectAlbum(request.payload.albumId);

        const {albumId} = require('../conf/current-album');
        const {photos} = require('../conf/photos')[albumId];

        delete require.cache[require.resolve('../conf/photos')];

        return h.response(photos.filter(photo => photo.received));
    }
};
