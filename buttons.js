var execSync = require('child_process').execSync;
var sleep = require("sleep");

var buttons = {
	pressButton: function(pin, duration) {
		var cmd = "gpio write "+ pin +" 0";
		console.log(cmd);
		execSync(cmd);

		sleep.sleep(duration);

		cmd = "gpio write "+ pin +" 1";
		console.log(cmd);
		execSync(cmd);
	},

	longPressButton: function(pin) {
		return buttons.pressButton(pin, 6);
	},

	shortPressButton: function(pin) {
		return buttons.pressButton(pin, 1);
	},

	coldRestartHost: function(host) {
		console.log("Cold restarting host "+ host.name);

		buttons.longPressButton(host.pwrPin);

		sleep.sleep(2);

		buttons.shortPressButton(host.pwrPin);
	},

	resetHost: function(host) {
		console.log("Resetting host "+ host.name);

		buttons.shortPressButton(host.resetPin);
	},

	initializePin: function(pin) {

		// TODO: don't assume OUT and high

		var cmd = "gpio mode "+ pin +" out";
		console.log(cmd);
		execSync(cmd);

		cmd = "gpio write "+ pin +" 1";
		console.log(cmd);
		execSync(cmd);
	},

	initializePins: function(config) {
		config.hosts.forEach(function(host, index, array) {
			buttons.initializePin(host.pwrPin);
			buttons.initializePin(host.resetPin);
		});
	}
};

module.exports = buttons;
