
var connect = require('connect');
var http = require('http');

var app = connect();

var protocol;

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

// respond to all requests
app.use(function(req, res){
	var url = req.url.substring(1, req.url.length);
	console.log(url);
  
	protocol.onMsg(url,function(msg){
		if(msg){
			console.log("Sending response ->"+msg.toString());
			res.end(msg.toString());
		}else{
			console.log("No response to send back");
			res.end("No response to send back");
		}
	});
});

//create node.js http server and listen on port
http.createServer(app).listen(2001);


var sim_gateway = function(prot) {
	protocol = prot;
};


module.exports = sim_gateway;


