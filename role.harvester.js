var roleHarvester = {
  run: function (creep, active, toolbox, source) {
    if (active) {
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
        toolbox.miner(creep, source);
      } else if (!creep.store.getFreeCapacity() && unloadTargets.length) {
        // TRANSFER
        if (
          creep.transfer(unloadTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(unloadTargets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      } else {
        // REST
        creep.moveTo(Game.flags.Rest1.pos, {
          visualizePathStyle: { stroke: "#00ffff" },
        });
        creep.say("💤");
      }
    } else {
      // REST
      creep.moveTo(Game.flags.Rest1.pos, {
        visualizePathStyle: { stroke: "#00ffff" },
      });
      creep.say("💤");
    }
  },
};

module.exports = roleHarvester;
