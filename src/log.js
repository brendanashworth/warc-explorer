'use strict';

const chalk = require('chalk');
const util = require('util');

// Log a message like console.log, but cyan.
module.exports = function() {
    var msg = util.format.apply(null, arguments);

    console.log(chalk.cyan(msg));
};

module.exports.error = function() {
    var msg = util.format.apply(null, arguments);

    console.log(chalk.yellow(msg));
};
