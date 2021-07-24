var roleUpgrader = {
	run: function (creep, activated_upgraders) {
		if (activated_upgraders) {
			if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
				// UPGRADE OFF
				creep.memory.upgrading = false;
			}

			if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
				// UPGRADE ON
				creep.memory.upgrading = true;
			}

			if (creep.memory.upgrading) {
				// UPGRADE
				creep.say('Upgrade ✔️');
				if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
				}
			} else {
				// MINE
				const energySources = creep.room.find(FIND_SOURCES);
				if (
					creep.harvest(energySources[0]) === ERR_NOT_IN_RANGE &&
					creep.harvest(energySources[0]) !== ERR_NO_PATH
				) {
					creep.moveTo(energySources[0]);
				} else if (creep.harvest(energySources[1]) === ERR_NOT_IN_RANGE) {
					creep.moveTo(energySources[1]);
				}
			}
		} else {
			// REST
			creep.say('💤');
			creep.moveTo(Game.flags.Rest1.pos, { visualizePathStyle: { stroke: '#00ffff' } });
		}
	},
};

module.exports = roleUpgrader;
