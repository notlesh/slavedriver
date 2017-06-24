/**
 * A sort of watchdog to ensure that my Ethereum machines are up and running.
 *
 * There's no quitting on this job.
 */
var PingChecker = require("./PingChecker");
var EthminerPoolChecker = require("./EthminerPoolChecker");
var buttons = require("./buttons");
var config = require("./config");

var pingCheckers = [];
var minerCheckers = [];

config.hosts.forEach(function(host, index, array) {
	pingCheckers[index] = new PingChecker(host);
	minerCheckers[index] = new EthminerPoolChecker(host);

	var pin = host.pwrPin

	var cmd = "gpio mode "+ pin +" out";
	console.log(cmd);
	execSync(cmd);

	cmd = "gpio write "+ pin +" 1";
	console.log(cmd);
	execSync(cmd);
});

// XXX: hack -- we can't call the miner API too frequently, so we alternate checking
var altMinerCheck = 0;

function mainLoop() {

	config.hosts.forEach(function(host, index, array) {
		var fail = false;

		var pingChecker = pingCheckers[index];
		var minerChecker = minerCheckers[index];

		pingChecker.check();
		if (! pingChecker.getStatus()) {
			console.log("FAIL - ping - "+ host.name +"!");

			fail = true;
		}

		if (altMinerCheck == index) {
			minerChecker.check();
		}
		if (! minerChecker.getStatus()) {
			console.log("FAIL - ethminer - "+ host.name +"!");

			fail = true;
		}

		if (fail) {
			restartHost(config.hosts[0]);
		}
	});

	altMinerCheck++;
	if (altMinerCheck > 1) {
		altMinerCheck = 0;
	}

	setTimeout(mainLoop, 120000);
}

setTimeout(mainLoop, 50); // initial kickoff; loop will schedule further calls
