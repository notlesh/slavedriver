// public
var ping = require("ping");
var Checker = require("./Checker");

/**
 * Checks that a given host is pingable
 */
module.exports = PingChecker;
PingChecker.prototype = Object.create(Checker.prototype);
function PingChecker(host, checkerConfig) {
	Checker.call(this, host, checkerConfig);

	this.consecutivePingFailures = 0;
};
PingChecker.prototype.doCheck = function() {
	console.log("Checking ping (host: "+ this.host.name +")");

	var self = this;

	ping.sys.probe(this.host.ip, function(isAlive) {
		if (isAlive) {
			self.consecutivePingFailures = 0;
		} else {
			console.log("!!! host "+ self.host.name +" did not reply");
			self.consecutivePingFailures++;
		}
	});

}
PingChecker.prototype.getStatus = function() {
	if (this.consecutivePingFailures > 0) {
		console.log("PingChecker.getStatus(): "+ this.consecutivePingFailures +" of 5");
	}
	return (this.consecutivePingFailures < this.checkerConfig.failureTolerance);
}
PingChecker.prototype.resetFailureCount = function() {
	this.consecutivePingFailures = 0;
}
