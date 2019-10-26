//Helpers.js

export const sanitizeBooleans = (value) => {
	if (typeof value == 'object' || typeof value=='array') {
		for (var i in value) {
			value[i] = sanitizeBooleans(value[i]);
		}
		return value;
	}
	if (value == 'False') {
		value = false;
	}
	if (value == 'True') {
		value = true;
	}
	return value
};

export const PIECES = {
	1: { name: 'Marshal', move: 1, count: 1, rackOrder: 2},
	2: { name: 'General', move: 1, count: 1, rackOrder: 3},
	3: { name: 'Colonel', move: 1, count: 2, rackOrder: 4},
	4: { name: 'Major', move: 1, count: 3, rackOrder: 5},
	5: { name: 'Captain', move: 1, count: 4, rackOrder: 6},
	6: { name: 'Lieutenant', move: 1, count: 4, rackOrder: 7},
	7: { name: 'Sergeant', move: 1, count: 4, rackOrder: 8},
	8: { name: 'Miner', move: 1, count: 5, defuse: true, rackOrder: 9},
	9: { name: 'Scout', move: 9, count: 8, rackOrder: 10},
	S: { name: 'Spy', move: 1, count: 1, capture: 1, rackOrder: 11},
	F: { name: 'Flag', move: 0, count: 1, flag: true, rackOrder: 1},
	B: { name: 'Bomb', move: 0, count: 6, rackOrder: 12}
};