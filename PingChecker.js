// public
var ping = require("ping");
var Checker = require("./Checker");
var Log = require("./Log");

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
	Log.debug("Checking ping (host: "+ this.host.name +")");

	var self = this;

	ping.sys.probe(this.host.ip, function(isAlive) {
		if (isAlive) {
			self.consecutivePingFailures = 0;
		} else {
			Log.warn("!!! host "+ self.host.name +" did not reply");
			self.consecutivePingFailures++;
		}
	});

}
PingChecker.prototype.getStatus = function() {
	return (this.consecutivePingFailures < this.checkerConfig.failureTolerance);
}
PingChecker.prototype.resetFailureCount = function() {
	this.consecutivePingFailures = 0;
}
