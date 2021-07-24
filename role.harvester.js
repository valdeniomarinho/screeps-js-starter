var roleHarvester = {
	run: function (creep, activated_hasvesters) {
		if (activated_hasvesters) {
			// TARGETS TO UNLOAD ENERGY
			const unloadTargets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (
						(structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN ||
							structure.structureType == STRUCTURE_TOWER) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
					);
				},
			});

			if (creep.store.getFreeCapacity() > 0 && unloadTargets.length) {
				// MINE
				const energySources = creep.room.find(FIND_SOURCES);
				if (creep.harvest(energySources[1]) === ERR_NOT_IN_RANGE) {
					console.log(creep.harvest(energySources[1]));
					creep.moveTo(energySources[1]);
				} else if (creep.harvest(energySources[1]) === ERR_NOT_IN_RANGE) {
					creep.moveTo(energySources[1]);
				}
			} else if (!creep.store.getFreeCapacity() && unloadTargets.length) {
				// TRANSFER
				if (creep.transfer(unloadTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(unloadTargets[0], { visualizePathStyle: { stroke: '#ffffff' } });
				}
			} else {
				// REST
				creep.moveTo(Game.flags.Rest1.pos, { visualizePathStyle: { stroke: '#00ffff' } });
				creep.say('💤');
			}
		} else {
			// REST
			creep.moveTo(Game.flags.Rest1.pos, { visualizePathStyle: { stroke: '#00ffff' } });
			creep.say('💤');
		}
	},
};

module.exports = roleHarvester;
