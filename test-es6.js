var E = require('./EventEmitter-es6');

var e = new E();

var sub1 = e.sub('change1', function () {
  console.log('change1...');
});

var sub2 = e.sub('change2', function () {
  console.log('change2...');
});

e.emit('change1');
e.emit('change2');

sub1();
console.log('------------');

e.emit('change1');
e.emit('change2');
