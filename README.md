# slavedriver
A specialized watchdog for Ethereum miners written in node.js designed to run on a Raspberry Pi.

slavedriver will periodically monitor a set of hosts, ensuring that they are reachable and that their mining software/hardware is operating as intended. GPIO pins on the Raspberry Pi can be connected to the power and/or reset pins of a motherboard to allow control of the remote host's poweron state at the electrical level.

Configuration is controlled through a config.js file. See its comments for explanation.
