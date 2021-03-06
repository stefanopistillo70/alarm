
var logger = require('../config/logger.js')('Authorization');

var authValues = [
	{key : {method : "*", url : "/"}, roles : ["admin"]},
	{key : {method : "*", url : "/eventLog"}, roles : ["admin","controller"]},
	{key : {method : "*", url : "/main/userInfo"}, roles : ["admin"]},
	{key : {method : "*", url : "/zone"}, roles : ["admin","controller"]},
	{key : {method : "*", url : "/zone/id"}, roles : ["admin"]},
	{key : {method : "*", url : "/device"}, roles : ["admin","controller"]},
	{key : {method : "*", url : "/device/id"}, roles : ["admin"]},
	{key : {method : "*", url : "/device/id/sensor"}, roles : ["controller"]},
	{key : {method : "*", url : "/user"}, roles : ["admin"]},
	{key : {method : "*", url : "/controller"}, roles : ["controller"]},
	{key : {method : "*", url : "/message"}, roles : ["controller"]},
	{key : {method : "*", url : "/config"}, roles : ["admin"]},
	{key : {method : "*", url : "/location"}, roles : ["admin"]},
	{key : {method : "*", url : "/location/id"}, roles : ["admin"]},
	{key : {method : "*", url : "/main/logout"}, roles : ["admin"]},
	{key : {method : "*", url : "/message"}, roles : ["admin"]},
	{key : {method : "*", url : "/file"}, roles : ["admin","controller"]},
	{key : {method : "*", url : "/auth/google/updateConsensus"}, roles : ["admin"]}
];




var authorization = function(apiVer, role, method,  url){
	
	logger.verbose("Check authorization method :"+method+" for url :"+url);
	
	var key = {method : method, url : url};
	
	var arrayLength = authValues.length;
	for (var i = 0; i < arrayLength; i++) {
		//logger.debug(authValues[i].key);
		var _url = apiVer+authValues[i].key.url;
		if((method == authValues[i].key.method) || (authValues[i].key.method == '*')){
			if(_url == '*'){
				if (role in authValues[i].roles) return true;
			}else{
				logger.debug(_url);
				if(_url == url ){
					if (authValues[i].roles.indexOf(role) != -1) return true;
				}else if(_url.endsWith("/id")){
					var re = /\/id/g;
					_urlTmp = _url.replace(re, '');
					//logger.debug("REPLACE1 ->"+_urlTmp);
					var n = url.lastIndexOf("/");
					urlTmp = url.substring(0, n);
					//logger.debug("REPLACE2 ->"+urlTmp);
					if(urlTmp == _urlTmp) return true;
				}else if(_url.indexOf("/id/") > 0){
					var re = /\/id/g;
					_urlTmp = _url.replace(re, '');
					logger.debug("REPLACE1 ->"+_urlTmp);
					var n = _url.lastIndexOf("/id/");
					var n1 = url.indexOf("/",n+1);
					urlTmp = url.substring(0, n)+url.substring(n1, url.lastIndexOf("/"));
					logger.debug("REPLACE2 ->"+urlTmp);
					if(urlTmp == _urlTmp) return true;
				}
			}
		}
	};
	
	return false;
}


module.exports = authorization;