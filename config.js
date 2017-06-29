var config = {
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
	]
};

module.exports = config;
