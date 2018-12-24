const google = require('../helpers/google');

module.exports = {
    method: 'POST',
    path: '/api/authenticate',
    handler:  (request, h) => {
        const response = h.response({
            tokens: google.authenticate(request.payload.code)
        });

        response.type('application/json');

        return response;
    }
};
