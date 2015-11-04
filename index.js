
var sentinel = require('redis-sentinel');

var endpoints = [];

for ( var i = 2 ; i < process.argv.length ; i = i + 2 ){

    endpoints.push({host: process.argv[i], port: process.argv[i+1]});

}

// List the sentinel endpoints
console.log(endpoints);

//tcp://10.233.194.227:26379,tcp://10.233.194.251:26379,tcp://10.233.194.252:26379

var opts = {}; // Standard node_redis client options
var masterName = 'redismaster';

// masterName and opts are optional - masterName defaults to 'mymaster'
var redisClient = sentinel.createClient(endpoints, masterName, opts);
var redisClient2 = sentinel.createClient(endpoints, masterName, opts);

// redisClient is a normal redis client, except that if the master goes down
// it will keep checking the sentinels for a new master and then connect to that.
// No need to monitor for reconnects etc - everything handled transparently
// Anything that persists over the normal node_redis reconnect will persist here.
// Anything that doesn't, won't.

// An equivalent way of doing the above (if you don't want to have to pass the endpoints around all the time) is
var Sentinel = sentinel.Sentinel(endpoints);
var masterClient = Sentinel.createClient(masterName, opts);


redisClient.on("message", function (channel, message) {
    console.log('Message received!');
    console.log(message)
});


redisClient.subscribe("testChannel");

/* Send test message */
redisClient2.publish("testChannel", "This is a test for sentinel");
