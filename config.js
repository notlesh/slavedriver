var config = {

	// hosts: a list of each host, and some parameters that
	// will help ensure the host is healthy
	hosts: [
	{
		name: "Eth0",
		ip: "192.168.10.139",
		pwrPin: 22,
		resetPin: 23,
		minHashRate: 140,
		numGPUs: 6,
		// sshKeyFile: "/home/pi/.ssh/ethos.id_vd25519",
		sshKeyFile: "/home/pi/.ssh/ethos.id_rsa",
		sshUserName: "ethos"
	},
	{
		name: "Eth1",
		ip: "192.168.10.137",
		pwrPin: 24,
		resetPin: 25,
		minHashRate: 128,
		numGPUs: 6,
		// sshKeyFile: "/home/pi/.ssh/ethos.id_ed25519",
		sshKeyFile: "/home/pi/.ssh/ethos.id_rsa",
		sshUserName: "ethos"
		
	}
	],

	// checker config: these parameters control
	// the behavior of various types of checkers
	sshCheckerConfig: {
		delayAfterReset: 120, // delay, in seconds, after host has been reset before attempting to test
		hashCheckDelayAfterReset: 180, // delay before checking any hashing (and GPU count) checks
		checkFrequency: 60, // frequency, in seconds, of tests

		sshConnectionFailureTolerance: 1,
		hashFileAgeFailureTolerance: 2,
		lowHashFailureTolerance: 4,
		lowGPUFailureToleraance: 1
	},

	pingCheckerConfig: {
		delayAfterReset: 60, // delay, in seconds, after host has been reset before attempting to test
		checkFrequency: 15, // frequency, in seconds, of ping tests
		failureTolerance: 2 // number of tolerated failures before resetting host
	}
};

module.exports = config;
