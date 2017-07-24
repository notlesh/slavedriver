/**
 * Stats for a host
 */
module.exports = GPUStats;
function GPUStats() {
	this.minHashrate = -1;
	this.maxHashrate = -1;
	this.avgHashrate = -1;
	this.hashrateAccumulator = 0;
	this.numHashrateSamples = 0;
};
GPUStats.prototype.addSample = function(hashrate) {

	// priming min is a bit cumbersome
	if (hashrate > 0) {
		if (this.minHashrate < 0 || hashrate < this.minHashrate) {
			this.minHashrate = hashrate;
		}
	}

	if (hashrate > this.maxHashrate) {
		this.maxHashrate = hashrate;
	}

	this.hashrateAccumulator += hashrate;
	this.numHashrateSamples++;
	this.avgHashrate = (this.hashrateAccumulator / this.numHashrateSamples);
}

