var execSync = require('child_process').execSync;
var sleep = require("sleep");

var buttons = {
	pressPowerButton: function(host, duration) {

		/*
		gpio.write(host.pwrPin, false, function(error) {
			if (error) {
				throw error;
			}
		});
		*/
		var cmd = "gpio write "+ host.pwrPin +" 0";
		console.log(cmd);
		execSync(cmd);

		sleep.sleep(duration);

		/*
		gpio.write(host.pwrPin, true, function(error) {
			if (error) {
				throw error;
			}
		});
		*/
		cmd = "gpio write "+ host.pwrPin +" 1";
		console.log(cmd);
		execSync(cmd);
	},

	longPressPowerButton: function(host) {
		return buttons.pressPowerButton(host, 6);
	},

	shortPressPowerButton: function(host) {
		return buttons.pressPowerButton(host, 1);
	},

	restartHost: function(host) {
		console.log("Restarting host "+ host.name);

		buttons.longPressPowerButton(host);

		sleep.sleep(2);

		buttons.shortPressPowerButton(host);
	},

	initializePins: function(config) {
		config.hosts.forEach(function(host, index, array) {
			var pin = host.pwrPin

			var cmd = "gpio mode "+ pin +" out";
			console.log(cmd);
			execSync(cmd);

			cmd = "gpio write "+ pin +" 1";
			console.log(cmd);
			execSync(cmd);
		});
	}
};

module.exports = buttons;
