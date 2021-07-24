var roleBuilder = {
  run: function (creep, active, toolbox, source) {
    if (active) {
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
          creep.say("Build ✔️");
          if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
              visualizePathStyle: { stroke: "#ffffff" },
            });
          }
        } else {
          // REST
          creep.say("💤");
          creep.moveTo(Game.flags.Rest1.pos, {
            visualizePathStyle: { stroke: "#00ffff" },
          });
        }
      } else {
        // MINE
        toolbox.miner(creep, source);
      }
    } else {
      // REST
      creep.say("💤");
      creep.moveTo(Game.flags.Rest1.pos, {
        visualizePathStyle: { stroke: "#00ffff" },
      });
    }
  },
};

module.exports = roleBuilder;
