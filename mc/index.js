var Memcached = require('memcached');
var memcached = new Memcached('localhost:3000');

memcached.set('foo', 'bar', 10, function (err) {
	memcached.get('foo', function (err, data) {
		console.log(data);
	 });
	});