/**
 * A sort of watchdog to ensure that my Ethereum machines are up and running.
 *
 * There's no quitting on this job.
 */
var PingChecker = require("./PingChecker");
var buttons = require("./buttons");
var config = require("./config");

buttons.initializePins(config);

var pingCheckers = [];

config.hosts.forEach(function(host, index, array) {
	pingCheckers[index] = new PingChecker(host);
});

function mainLoop() {

	config.hosts.forEach(function(host, index, array) {
		var fail = false;

		var pingChecker = pingCheckers[index];

		pingChecker.check();
		if (! pingChecker.getStatus()) {
			console.log("FAIL - ping - "+ host.name +"!");

			fail = true;
		}

		if (fail) {
			buttons.restartHost(config.hosts[0]);
		}
	});

	setTimeout(mainLoop, 120000);
}

setTimeout(mainLoop, 50); // initial kickoff; loop will schedule further calls
