const fs = require('fs');
const {albumId} = require('../conf/current-album');

module.exports = {
    method: 'GET',
    path: '/api/photo',
    handler: async (request, h) => {
        return h.response(fs.readFileSync(`${__dirname}/../photos/${albumId}/${request.query.photoId}`))
            .header('Content-Disposition', 'inline').header('Content-type', 'image/png');
    }
};
