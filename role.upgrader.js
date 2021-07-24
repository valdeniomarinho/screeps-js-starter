var roleUpgrader = {
  run: function (creep, active, toolbox, source) {
    if (active) {
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
        creep.say("Upgrade ✔️");
        if (
          creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE
        ) {
          creep.moveTo(creep.room.controller, {
            visualizePathStyle: { stroke: "#ffffff" },
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

module.exports = roleUpgrader;
