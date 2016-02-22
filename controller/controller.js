

var fs = require("fs")
var vm = require('vm')
console.log("Start");

//vm.runInThisContext(fs.readFileSync(__dirname + "/sensor.js"))
//vm.runInThisContext(fs.readFileSync(__dirname + "/gateway.js"))
//require('./sensor.js').sensor();


var gateway = require('./gateway.js')

var g = new gateway();

var msg = gateway.parseMsg("12;6;0;0;3;My Light\n");
console.log("MSG -> " + msg.toString());


//var nm = require('./NodeManager.js')
//console.log(nm);
//var nmInstance = nm.getInstance();
//console.log(nmInstance);


var Repository = require('./Repository.js');
var r = new Repository();

r.addNewNode(Repository.createNode(1,"node1"));
r.addNewNode(Repository.createNode(2,"node2"));



