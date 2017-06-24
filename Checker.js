// public

/**
 * Checker is a class that checks for certain conditions on
 * a given host.
 */
module.exports = Checker;
function Checker(host) {
	this.host = host;
};
Checker.prototype.check = function() {
	console.log("Override check()!");
}
Checker.prototype.getStatus = function() {
	console.log("Override getStatus()!");
	// should return true or false based on analysis of host
}
