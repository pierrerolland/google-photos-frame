const albums = require('../conf/albums.json');

module.exports = {
    method: 'GET',
    path: '/api/albums',
    handler: (request, h) => h.response(albums)
};
