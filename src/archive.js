'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const stream = require('stream');

const WARCStream = require('warc');

const log = require('./log');

// The WARC archives.
const archives = [];

module.exports = function(filename) {
    // Check the file extension.
    const ext = path.extname(filename);
    if (ext != '.gz' && ext != '.warc') {
        log.error('\n\tError: the archive file must end in .warc or .gz\n');
        log.error('You supplied: %s (%s)', filename, ext);

        process.exit(1);
    }

    // Start reading, gunzip if it is gzip'ed.
    const readstream = fs.createReadStream(filename);
    readstream.on('error', function(e) {
        log.error('\n\tAn error occurred while reading the archive:');
        log.error('\t%s\n', e.message);

        throw e;
    });
    readstream.on('finish', function() {

    });

    var decompress = new stream.PassThrough();
    if (ext == '.gz') {
        decompress = new zlib.Gunzip();
    }

    const warc = new WARCStream();

    warc.on('data', function(archive) {
        archives.push(archive);
    });

    readstream.pipe(decompress).pipe(warc);

    return search;
};

// This is really inefficient.
function search(url) {
    for (let i = 0; i < archives.length; i++) {
        let archive = archives[i];

        // Check for WARC-Type: response
        if (archive.headers['WARC-Type'] != 'response') {
            continue;
        }

        // Response type must be application/http.
        if (!archive.headers['Content-Type'].includes('application/http')) {
            continue;
        }

        // Ensure the URL matches.
        if (archive.headers['WARC-Target-URI'] != url) {
            continue;
        }

        // Seems good.
        return archive;
    }
}
