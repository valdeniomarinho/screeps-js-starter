class utils {
  miner(creep, source) {
    const energySources = creep.room.find(FIND_SOURCES);

    //&& creep.harvest(energySources[0]) !== ERR_NO_PATH ??
    if (creep.harvest(energySources[source]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(energySources[source]);
    }
  }
}

module.exports = utils;
