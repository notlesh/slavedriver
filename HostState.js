/**
 * State for a host
 */
module.exports = HostState;
HostState.prototype.lastReset = 0; // in UNIX epoch / millis, our local time
function HostState() {
	this.lastReset = (new Date()).getTime();
};

