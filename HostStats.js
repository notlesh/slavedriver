/**
 * Stats for a host
 */
module.exports = HostStats;
function HostStats() {
	this.currentUptime = 0;
	this.currentUptimePretty = "0 seconds";
	this.longestUptime = 0;
	this.longestUptimePretty = "0 seconds";
	this.numResets = 0;
};

