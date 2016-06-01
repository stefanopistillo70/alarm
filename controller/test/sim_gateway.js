
var connect = require('connect');
var http = require('http');

var ports = [];

var getPort = function(){
	if(ports.length == 0){
		ports.push(2001);
		return ports[0];
	}else{
		ports.push(2002);
		return ports[1];
	};
} 


var sim_gateway = function(protocol) {
	
	var app = connect();

	// parse urlencoded request bodies into req.body
	var bodyParser = require('body-parser');
	app.use(bodyParser.urlencoded());

	// respond to all requests
	app.use(function(req, res){
		var url = req.url.substring(1, req.url.length);
		console.log("***** SIMULATOR  URL ->"+url);
		
		if(url != "favicon.ico"){
	  
			protocol.onMsg(url,function(msg){
				if(msg){
					console.log("***** SIMULATOR  Sending response ->");
					console.log(msg);
					res.end(msg.toString());
				}else{
					console.log("***** SIMULATOR  No response to send back");
					res.end("No response to send back");
				}
			});
		}else res.end("");
	});

	//create node.js http server and listen on port
	
	var port = getPort();
	
	http.createServer(app).listen(port);
};


module.exports = sim_gateway;


