
var jwtSimple = require('jwt-simple');
var uuid = require('node-uuid');

var secret = 'secret-pwd';
var expire_time = 60000;
//var expire_time = 36000000;



var jwt = {
	getJWT : function(user, refresh){
		
		var expires = new Date().getTime()+expire_time;
		var access_token = jwtSimple.encode({
			jti : uuid.v4(),
			iss: user,
			exp: expires
		}, secret);

		if(refresh){
			var refresh_token = jwtSimple.encode({
				jti : uuid.v4(),
				iss: user,
				exp: 0
			}, secret);
			
			return { access_token: access_token,  refresh_token: refresh_token};
		}else{
			return { access_token: access_token};
		}
	},

	verifyJWT : function(token, iss){
		var decoded = jwtSimple.decode(token, secret);
		var now = new Date().getTime();
		if ((iss === decoded.iss) && ((decoded.exp == 0) || ((decoded.exp - now) > 0 )) ) return true;
		else return false
		
	}
}



module.exports = jwt;