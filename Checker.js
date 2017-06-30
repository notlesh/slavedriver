// public

/**
 * Checker is a class that checks for certain conditions on
 * a given host.
 */
module.exports = Checker;
function Checker(host, checkerConfig) {
	this.host = host;
	this.checkerConfig = checkerConfig;
};
Checker.prototype.doCheck = function() {
	throw new Error("Subclass should override Checker.doCheck()");
}
Checker.prototype.check = function() {
	this.doCheck();

	var timeout = this.checkerConfig.checkFrequency * 1000;

	var self = this;
	this.checkerTimeoutId = setTimeout(function() {self.check()}, timeout);
}
Checker.prototype.getStatus = function() {
	throw new Error("Subclass should override Checker.getStatus()");
	// should return true or false based on analysis of host
}
Checker.prototype.resetFailureCount = function() {
	throw new Error("Subclass should override Checker.resetFailureCount()");
}
Checker.prototype.initializeCheckLoop = function() {
	// schedule periodic checks for this checker based on config

	var timeout = this.checkerConfig.delayAfterReset * 1000;
	var self = this;
	this.checkerTimeoutId = setTimeout(function() {self.check()}, timeout);
}
Checker.prototype.handleResetHost = function() {
	// cancel any outstanding timouts and reschedule for a longer period
	cancelTimeout(this.checkerTimeoutId);
	this.checkerTimeoutId = null;

	this.resetFailureCount();
	this.initializeCheckLoop();
}
