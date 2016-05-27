
var logger = require('../config/logger.js')('Authorization');

var authValues = [
	{key : {method : "*", url : "/"}, roles : ["admin"]},
	{key : {method : "*", url : "/eventLog"}, roles : ["admin"]},
	{key : {method : "*", url : "/main/userInfo"}, roles : ["admin"]},
	{key : {method : "*", url : "/zone"}, roles : ["admin","controller"]},
	{key : {method : "*", url : "/zone/id"}, roles : ["admin"]},
	{key : {method : "*", url : "/device"}, roles : ["admin"]},
	{key : {method : "*", url : "/device/id"}, roles : ["admin"]},
	{key : {method : "*", url : "/user"}, roles : ["admin"]},
	{key : {method : "*", url : "/controller"}, roles : ["controller"]},
	{key : {method : "*", url : "/message"}, roles : ["controller"]}
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
				logger.info(_url);
				if(_url === url ){
					if (authValues[i].roles.indexOf(role) != -1) return true;
				}else if(_url.endsWith("/id")){
					var re = /\/id/g;
					_urlTmp = _url.replace(re, '');
					//logger.info("REPLACE1 ->"+_urlTmp);
					var n = url.lastIndexOf("/");
					urlTmp = url.substring(0, n);
					//logger.info("REPLACE2 ->"+urlTmp);
					if(urlTmp === _urlTmp) return true;
				}
			}
		}
	};
	
	return false;
}


module.exports = authorization;