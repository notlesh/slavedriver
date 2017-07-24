var GPUStats = require("./GPUStats");

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

	// prime max number of GPUs we expect
	// TODO: handle more gracefully
	this.gpuStats = [
		new GPUStats(),
		new GPUStats(),
		new GPUStats(),
		new GPUStats(),
		new GPUStats(),
		new GPUStats()
	];
};

