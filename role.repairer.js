var target_count = 0;
var hitsToRepair = 50000;

const roleRepairer = {
	run: function (creep) {
		if (creep.memory.building && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === 0) {
			// ENERGY EMPTY
			creep.memory.building = false;
		}

		if (
			!creep.memory.building &&
			creep.store.getUsedCapacity([RESOURCE_ENERGY]) === creep.store.getCapacity([RESOURCE_ENERGY])
		) {
			// ENERGY FULL
			creep.memory.building = true;
		}

		if (creep.memory.building) {
			// BUILD
			creep.say('Repair ✔️');
			// GET STRUCTURES AND DAMAGED
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (
						(structure.structureType === STRUCTURE_WALL ||
							structure.structureType === STRUCTURE_ROAD ||
							structure.structureType === STRUCTURE_CONTAINER ||
							structure.structureType === STRUCTURE_RAMPART) &&
						structure.hits < structure.hitsMax
					);
				},
			});

			// NOT IN RANGE
			if (targets.length) {
				if (targets[target_count].hits < hitsToRepair) {
					if (creep.repair(targets[target_count]) === ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[target_count]);
					}
				} else {
					target_count += 1;
					if (target_count === targets.length) {
						target_count = 0;
					}
				}
			} else {
				// REST
				creep.moveTo(Game.flags.Rest1.pos);
				creep.say('💤');
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

module.exports = roleRepairer;
