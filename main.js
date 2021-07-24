const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');

//╔════════════════════════════╗
//>Section:   Global Variables ║
//╚════════════════════════════╝
const activated_harvesters = true;
const activated_harvesters_external = false;
const activated_harvesters_mineral = false;
const activated_builders = false;
const activated_upgraders = false;
const activated_repairers = false;
const activated_notifiers = false;
const activated_attackers = false;
const activated_defenders = false;
const activated_explorers = false;
const activated_claimers = false;
const activated_fillers = false;

const spawn_harvester = 1;
const spawn_harvester_external = 0;
const spawn_harvester_mineral = 0;
const spawn_builder = 0;
const spawn_upgrader = 0;
const spawn_repair = 0;
const spawn_notifier = 0;
const spawn_attacker = 0;
const spawn_defender = 0;
const spawn_explorer = 0;
const spawn_claimer = 0;
const spawn_filler = 0;

// T = 1 roads, 2 plain, 10 swamp
// MOVE not generate fatigue
// empty CARRY not generate fatigue
// fatigue ? !move : move;

// F = T*n(S) + ?n(CARRY) - 2*n(MOVES)
// [WORK, CARRY, MOVE]
const model_harvesters = [WORK, CARRY, MOVE];
const model_harvesters_external = [];
const model_harvesters_mineral = [];
const model_builders = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
const model_upgraders = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE];
const model_repairers = [WORK, CARRY, MOVE];
const model_notifiers = [];
const model_attackers = [];
const model_defenders = [];
const model_explorers = [];
const model_claimers = [];
const model_fillers = [];

module.exports.loop = function () {
	// ╔═══════════════════╗
	// >Section:   CodeLab ║
	// ╚═══════════════════╝
	try {
		// put your test code here
	} catch (error) {
		console.log(error);
	}

	// ╔════════════════════╗
	// >Section:   Watchers ║
	// ╚════════════════════╝
	const total_harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	const total_builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	const total_upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	const total_repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');

	// ╔═══════════════════╗
	// >Section:   Loggers ║
	// ╚═══════════════════╝
	for (const name in Game.rooms) {
		console.log(`╔════════════════════════════════════════════════`);
		console.log(`║─┤Room "${name}"`);
		console.log(`║─┤Total Energy: ${Game.rooms[name].energyAvailable}`);
		console.log(`║─┤Slots per Creep: ${Math.floor(Game.rooms[name].energyAvailable / 50)}`);
		console.log(`║─┤⛏️ Harvesters: ${total_harvesters.length}`);
		console.log(`║─┤🔨 Builders: ${total_builders.length} `);
		console.log(`║─┤🔺 Upgraders: ${total_upgraders.length}`);
		console.log(`║─┤🔧 Repairers: ${total_repairers.length}`);
		console.log(`╚════════════════════════════════════════════════`);
	}

	// ╔══════════════════════════╗
	// >Section:   Memory Cleaner ║
	// ╚══════════════════════════╝
	for (const name in Memory.creeps) {
		if (!Game.creeps[name]) {
			console.log(`Clearing non-existing creep memory: ${name}`);
			delete Memory.creeps[name];
		}
	}

	// ╔═════════════════════════════╗
	// >Section:   Notify Spawning   ║
	// ╚═════════════════════════════╝
	if (Game.spawns['Spawn1'].spawning) {
		const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
		const msg = `Spawning: ${spawningCreep.memory.role}`;
		Game.spawns['Spawn1'].room.visual.text(
			msg,
			Game.spawns['Spawn1'].pos.x,
			Game.spawns['Spawn1'].pos.y + 1.5,
			{ align: 'center', opacity: 0.8 }
		);
	}

	// ╔═════════════════════════════╗
	// >Section:   Harvester Spawner ║
	// ╚═════════════════════════════╝
	if (total_harvesters.length < spawn_harvester) {
		const newName = `Harvester${Game.time}`;
		console.log(`Spawning new harvester: ${newName}`);
		Game.spawns['Spawn1'].spawnCreep(model_harvesters, newName, {
			memory: { role: 'harvester' },
		});
	}

	// ╔═══════════════════════════╗
	// >Section:   Builder Spawner ║
	// ╚═══════════════════════════╝
	if (total_builders.length < spawn_builder) {
		const newName = `Builder${Game.time}`;
		console.log(`Spawning new builder: ${newName}`);
		Game.spawns['Spawn1'].spawnCreep(model_builders, newName, {
			memory: { role: 'builder' },
		});
	}

	// ╔════════════════════════════╗
	// >Section:   Upgrader Spawner ║
	// ╚════════════════════════════╝
	if (total_upgraders.length < spawn_upgrader) {
		const newName = `Upgrader${Game.time}`;
		console.log(`Spawning new upgrader: ${newName}`);
		Game.spawns['Spawn1'].spawnCreep(model_upgraders, newName, { memory: { role: 'upgrader' } });
	}

	// ╔═══════════════════════════╗
	// >Section:  Repairer Spawner ║
	// ╚═══════════════════════════╝
	if (total_repairers.length < spawn_repair) {
		const newName = `Repairer${Game.time}`;
		console.log(`Spawning new repairer: ${newName}`);
		Game.spawns['Spawn1'].spawnCreep(model_repairers, newName, {
			memory: { role: 'repairer' },
		});
	}

	// ╔═══════════════════════════╗
	// >Section:   Role Assignment ║
	// ╚═══════════════════════════╝
	for (let name in Game.creeps) {
		let creep = Game.creeps[name];
		switch (creep.memory.role) {
			// case 'harvester':
			// 	roleHarvester.run(creep, activated_harvesters);
			// 	break;
			// case 'harvester_external':
			// 	roleHarvesterExternal.run(creep, activated_harvesters);
			// 	break;
			// case 'harvester_mineral':
			// 	roleHarvesterMineral.run(creep, activated_harvesters);
			// 	break;
			// case 'upgrader':
			// 	roleUpgrader.run(creep, activated_upgraders);
			// 	break;
			// case 'builder':
			// 	roleBuilder.run(creep, activated_builders);
			// 	break;
			// case 'repairer':
			// 	roleRepairer.run(creep, activated_repairers);
			// 	break;
			// case 'defender':
			// 	roleDefender.run(creep);
			// 	break;
			// case 'attacker':
			// 	roleAttacker.run(creep);
			// 	break;
			// case 'claimer':
			// 	roleClaimer.run(creep);
			// 	break;
			// case 'filler':
			// 	roleFiller.run(creep);
			// 	break;
			// case 'explorer':
			// 	roleExplorer.run(creep);
			// 	break;
		}
	}

	// ╔════════════════════════════════════════════════╗
	// >Section:   Tower
	// @desc     Tower Management
	// ╚════════════════════════════════════════════════╝
	// var tower = Game.getObjectById('TOWER_ID');
	// if (tower) {
	// 	var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
	// 		filter: (structure) => structure.hits < structure.hitsMax,
	// 	});
	// 	if (closestDamagedStructure) {
	// 		tower.repair(closestDamagedStructure);
	// 	}

	// 	var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
	// 	if (closestHostile) {
	// 		tower.attack(closestHostile);
	// 	}
	// }
};
