var winston = require("winston");
const fs = require('fs');
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const timestamp = (new Date()).getTime();

// initialize logger -- colorized console output
const tsFormat = () => (new Date()).toLocaleTimeString();
const Log = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
	  level: "info"
    }),
	new (winston.transports.File)({
		filename: `${logDir}/${timestamp}.log`,
		timestamp: tsFormat,
		level: "silly"
	})
  ]
});

module.exports = Log;
