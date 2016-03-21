'use strict';

const path = require('path');

const express = require('express');
const app = express();

// Needs to be initiated.
var archive;

// Init the logger.
const morgan = require('morgan');
app.use(morgan('common', {
    skip: (req, res) => { return !req.url.startsWith('/retrieve'); },
    immediate: true
}));

app.get('/', function(req, res) {
    const file = path.resolve(__dirname, '..', 'resources', 'search.html');
    res.sendFile(file);
});

app.get('/retrieve', function(req, res) {
    var url = req.query.url;
    if (typeof url != 'string' && url != '') {
        return res.sendStatus(404).end();
    }

    // Check the archive.
    var arc = archive(url);
    if (!arc) {
        return res.sendStatus(404).end();
    }

    // Write the logged response straight to the socket.
    res.socket.write(arc.content);
});

module.exports = function(arc) {
    archive = arc;
    return app;
};
