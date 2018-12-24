'use strict';

const Hapi = require('hapi');
const fs = require('fs');
const path = require('path');

const server = Hapi.server({
    port: 3001,
    host: 'localhost'
});

const routePath = path.join(__dirname, "routes");
fs.readdirSync(routePath).forEach(function(file) {
    server.route(require(`${routePath}/${file}`));
});

const init = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
});

init();
