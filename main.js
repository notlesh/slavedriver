/**
 * A sort of watchdog to ensure that my Ethereum machines are up and running.
 *
 * There's no quitting on this job.
 */
var PingChecker = require("./PingChecker");
var SSHChecker = require("./SSHChecker");
var HostStats = require("./HostStats");
var HostState = require("./HostState");
var buttons = require("./buttons");
var config = require("./config");
var Log = require("./Log");

buttons.initializePins(config);

// initialize checkers, host info, etc.
var pingCheckers = [];
var sshCheckers = [];
var hostInfo = [];
config.hosts.forEach(function(host, index, array) {
	pingCheckers[index] = new PingChecker(host, config.pingCheckerConfig);
	sshCheckers[index] = new SSHChecker(host, config.sshCheckerConfig);

	hostInfo[index] = {
		stats: new HostStats(),
		state: new HostState()
	};

	// initialize each checker
	// this will kick off initial requests, which will handle subsequent scheduling
	// of future checks
	pingCheckers[index].initializeCheckLoop();
	sshCheckers[index].initializeCheckLoop();
});


function mainLoop() {

	// periodically check status. if something fails, reset host

	config.hosts.forEach(function(host, index, array) {
		pingChecker = pingCheckers[index];
		sshChecker = sshCheckers[index];

		var fail = false;

		if (! pingChecker.getStatus()) {
			Log.warn("Resetting host "+ host.name +", ping checker failed");
			fail = true;
		}

		if (! sshChecker.getStatus()) {
			Log.warn("Resetting host "+ host.name +", ssh checker failed");
			fail = true;
		}

		if (fail) {

			// update stats/state
			var stats = hostInfo[index].stats;
			var state = hostInfo[index].state;

			var now = (new Date()).getTime();
			var uptime = (now - state.lastReset);
			state.lastReset = now;

			stats.numResets++;
			if (stats.longestUptime < uptime) {
				stats.longestUptime = uptime;
			}

			Log.info("Resetting host "+ host.name);
			Log.info("  stats: "+ JSON.stringify(stats));

			buttons.resetHost(host);
			pingChecker.handleResetHost();
			sshChecker.handleResetHost();
		}
	});

	setTimeout(mainLoop, 250);
}

setTimeout(mainLoop, 50); // initial kickoff; loop will schedule further calls
