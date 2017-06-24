var config = {
	hosts: [
	{
		name: "Eth0",
		ip: "192.168.10.139",
		pwrPin: 22,
		resetPin: 23,
		minHashRate: 140
	},
	{
		name: "Eth1",
		ip: "192.168.10.137",
		pwrPin: 24,
		resetPin: 25,
		minHashRate: 105
	}
	]
};

module.exports = config;
