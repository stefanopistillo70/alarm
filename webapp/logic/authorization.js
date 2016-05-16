
var logger = require('../config/logger.js')('Authorization');

var authMap = {};

authData[{method : "GET", url : "/eventLog"}] = ["admin"];



var authorization = function(role, method,  url){
	
	logger.info("Check authorization method :"+method+" for url :"+url);
	
	var key = {{method : method, url : url}}
	if(key in authMap) return true;
	else return false;

}


module.exports = authorization;