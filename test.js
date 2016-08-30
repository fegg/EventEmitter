var EventEmitter = require('./EventEmitter');

var events = new EventEmitter();

function onChange1 () {
	console.log('change emit 1...');
}

function onChange2 () {
	console.log('change emit 2...');
}

function onChange3 () {
	console.log('change emit 3...');
}

function onChange4 () {
	console.log('change emit 4...');
}

var all = {};

events.on('change', onChange1);
events.on('change', onChange2);
events.once('change', onChange3);

console.log('--------------');
all = events.getListenersAsObject('change');
console.log(all);
console.log(all.change.length === 3);
console.log('--------------');

events.emit('change');

console.log('--------------');
all = events.getListenersAsObject('change');
console.log(all);
console.log(all.change.length === 2);
console.log('--------------');

events.off('change', onChange1);

console.log('--------------');
all = events.getListenersAsObject('change');
console.log(all);
console.log(all.change.length === 1);
console.log('--------------');

events.on('change', onChange4);

console.log('--------------');
all = events.getListenersAsObject('change');
console.log(all);
console.log(all.change.length === 2);
console.log('--------------');

events.destory('change');

console.log('--------------');
all = events.getListenersAsObject('change');
console.log(all);
console.log(all.change.length === 0);
console.log('--------------');