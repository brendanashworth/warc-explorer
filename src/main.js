'use strict';

const log = require('./log');

log('Booting the warc-explorer...');

// Parse arguments and get the archive.
if (process.argv.length != 3) {
    log.error('\n\tUsage: warc-explorer [archive]\n');
    log('Where: [archive] is a .warc or .warc.gz file');

    process.exit(1);
}

const archive = (require('./archive'))(process.argv[2]);

// Start the app.
const app = (require('./app'))(archive);

// Bind and listen.
const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';

app.listen(port, host, function() {
    log('Listening on %s:%s', host, port);
});
