/**
 * A sort of watchdog to ensure that my Ethereum machines are up and running.
 *
 * There's no quitting on this job.
 */
var PingChecker = require("./PingChecker");
var SSHChecker = require("./SSHChecker");
var buttons = require("./buttons");
var config = require("./config");

buttons.initializePins(config);

var pingCheckers = [];
var sshCheckers = [];

config.hosts.forEach(function(host, index, array) {
	pingCheckers[index] = new PingChecker(host);
	sshCheckers[index] = new SSHChecker(host);
});

function mainLoop() {

	var delay = 30000; // delay before next loop -- we will further slow down if we restart a host

	config.hosts.forEach(function(host, index, array) {
		var fail = false;

		var pingChecker = pingCheckers[index];
		var sshChecker = sshCheckers[index];

		pingChecker.check();
		if (! pingChecker.getStatus()) {
			console.log("FAIL - ping - "+ host.name +"!");

			fail = true;
		}

		sshChecker.check();
		if (! sshChecker.getStatus()) {
			console.log("FAIL - ssh - "+ host.name +"!");
			console.log(sshChecker);

			fail = true;
		}

		if (fail) {
			buttons.resetHost(config.hosts[0]);
			pingChecker.resetFailureCount();
			sshChecker.resetFailureCount();

			delay = 60000;
		}
	});

	setTimeout(mainLoop, delay);
}

setTimeout(mainLoop, 50); // initial kickoff; loop will schedule further calls
