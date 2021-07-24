var roleBuilder = {
	run: function (creep) {
		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
			// BUILD OFF
			creep.memory.building = false;
		}

		if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
			// BUILD ON
			creep.memory.building = true;
		}

		if (creep.memory.building) {
			// GET CONSTRUCTION SITES
			const targets = creep.room.find(FIND_CONSTRUCTION_SITES);

			if (targets.length) {
				// BUILD
				creep.say('Build ✔️');
				if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
				}
			} else {
				// REST
				creep.say('💤');
				creep.moveTo(Game.flags.Rest1.pos, { visualizePathStyle: { stroke: '#00ffff' } });
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
	},
};

module.exports = roleBuilder;
