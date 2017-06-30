// public
var node_ssh = require("node-ssh");
var Checker = require("./Checker");
var Log = require("./Log");

/**
 * Checks that we can SSH into a given host
 */
module.exports = SSHChecker;
SSHChecker.prototype = Object.create(Checker.prototype);
function SSHChecker(host, checkerConfig) {
	Checker.call(this, host, checkerConfig);

	this.numSSHFailures = 0;
	this.numHashFileAgeFailures = 0;
	this.numLowHashes = 0;
	this.numLowGPUs = 0;
};
SSHChecker.prototype.doCheck = function() {
	Log.debug("Checking ssh/hash (host: "+ this.host.name +")");

	var self = this;

	var ssh = new node_ssh();

	ssh.connect({
		host: self.host.ip,
		username: self.host.sshUserName,
		privateKey: self.host.sshKeyFile
	})
	.then(function() {

		self.numSSHFailures = 0;

		// this should be our ssh object (now with a valid connection)
		ssh.execCommand('echo $(($(date +%s) - $(date +%s -r "/var/run/ethos/miner_hashes.file")))')
		.then(function(result) {
			// console.log(result);

			var age = parseInt(result.stdout);

			if (age > 10) {
				Log.warn("SSHChecker ("+ self.host.name +"): Hash file is old: "+ age +" seconds");
				self.numHashFileAgeFailures++;
			} else {
				self.numHashFileAgeFailures = 0;
			}
		})
		.catch(function(error) {
			Log.warn("SSHChecker ("+ self.host.name +"): catch() called trying to obtain age of hash file");
			console.log(error);
			self.numHashFileAgeFailures++;
		});

		// ensure the miner speeds are acceptable
		ssh.execCommand('tail -n1 /var/run/ethos/miner_hashes.file')
		.then(function(result) {
			// console.log(result);

			var totalHashRate = 0;
			var hashRates = result.stdout.split(' ');
			var numHashesReported = 0;
			hashRates.forEach(function(hashRateStr, index, array) {
				var hashRate = parseFloat(hashRateStr);
				totalHashRate += hashRate;
				numHashesReported++;
			});

			if (totalHashRate < self.host.minHashRate) {
				Log.warn("SSHChecker ("+ self.host.name +"): hash rate is low ("+ totalHashRate +" < "+ self.host.minHashRate +")" );
				self.numLowHashes++;
			} else {
				self.numLowHashes = 0;
			}

			if (numHashesReported < self.host.numGPUs) {
				Log.warn("SSHChecker ("+ self.host.name +"): Too few GPUs! ("+ numHashesReported +" < "+ self.host.numGPUs +")" );
				self.numLowGPUs++;
			} else {
				self.numLowGPUs = 0;
			}
		})
		.catch(function(error) {
			Log.error("SSHChecker ("+ self.host.name +"): catch() called trying to obtain hash rates");
			Log.error(error);
			self.numHashFileAgeFailures++;
		});

	}).catch(function(error) {
		Log.error("SSHChecker ("+ self.host.name +"): catch() called for SSH connection");
		Log.error(error);

		self.numSSHFailures++;
	});

}
SSHChecker.prototype.getStatus = function() {
	var failure = (this.numSSHFailures > this.checkerConfig.sshConnectionFailureTolerance)
		|| (this.numHashFileAgeFailures > this.checkerConfig.hashFileAgeFailureTolerance)
		|| (this.numLowHashes > this.checkerConfig.lowHashFailureTolerance)
		|| (this.numLowGPUs > this.checkerConfig.lowGPUFailureToleraance);

	return (! failure);
}
SSHChecker.prototype.resetFailureCount = function() {
	this.numSSHFailures = 0;
	this.numHashFileAgeFailures = 0;
	this.numLowHashes = 0;
	this.numLowGPUs = 0;
}
