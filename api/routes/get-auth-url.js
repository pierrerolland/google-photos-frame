const google = require('../helpers/google');

module.exports = {
    method: 'GET',
    path: '/api/auth-url',
    handler: (request, h) => {
        const response = h.response({
            authUrl: google.getAuthUrl()
        });

        response.type('application/json');

        return response;
    }
};
