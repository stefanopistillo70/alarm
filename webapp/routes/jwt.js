
var jwtSimple = require('jwt-simple');
var secret = 'secret-pwd';

var jwt = {
	getJWT : function(user, refresh){
		
		var expires = new Date().getTime()+3600000;
		var access_token = jwtSimple.encode({
			iss: user,
			exp: expires
		}, secret);

		if(refresh){
			var refresh_token = jwtSimple.encode({
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