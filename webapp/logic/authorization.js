
var logger = require('../config/logger.js')('Authorization');

var authValues = [
	{key : {method : "*", url : "/"}, roles : ["admin"]},
	{key : {method : "*", url : "/eventLog"}, roles : ["admin"]},
	{key : {method : "*", url : "/main/userInfo"}, roles : ["admin"]},
	{key : {method : "*", url : "/zone"}, roles : ["admin"]},
	{key : {method : "*", url : "/device"}, roles : ["admin"]}
];




var authorization = function(apiVer, role, method,  url){
	
	logger.info("Check authorization method :"+method+" for url :"+url);
	
	var key = {method : method, url : url};
	
	var arrayLength = authValues.length;
	for (var i = 0; i < arrayLength; i++) {
		//logger.info(authValues[i].key);
		var _url = apiVer+authValues[i].key.url;
		if((method === authValues[i].key.method) || (authValues[i].key.method == '*')){
			if(_url === '*'){
				if (role in authValues[i].roles) return true;
			}else{
				logger.info(url);
				logger.info(_url);
				if(_url === url ){
					if (authValues[i].roles.indexOf(role) != -1) return true;
				};
			}
		}
	};
	
	return false;
}


module.exports = authorization;