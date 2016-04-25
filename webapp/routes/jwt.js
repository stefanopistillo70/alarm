
var jwtSimple = require('jwt-simple');
var uuid = require('node-uuid');

var secret = 'secret-pwd';
var duration_time = 60000;
//var expire_time = 36000000;



var jwt = {
	getJWT : function(user, refresh, audience){
		
		var expire_at = new Date().getTime()+duration_time;
		var access_token = jwtSimple.encode({
			jti : uuid.v4(),
			sub : user,
			aud : audience,
			iss: "account.domusguard.com",
			exp: expire_at
		}, secret);

		if(refresh){
			var refresh_token = jwtSimple.encode({
				jti : uuid.v4(),
				sub : user,
				aud : audience,
				iss: "account.domusguard.com",
				exp: 0
			}, secret);
			
			return { access_token: access_token, expire_at: expire_at, duration_time: duration_time, refresh_token: refresh_token};
		}else{
			return { access_token: access_token, expire_at: expire_at, duration_time: duration_time};
		}
	},

	verifyJWT : function(token, iss){
		var decoded = jwtSimple.decode(token, secret);
		var now = new Date().getTime();
		if ((iss === decoded.sub) && ((decoded.exp == 0) || ((decoded.exp - now) > 0 )) ) return true;
		else return false
		
	}
}



module.exports = jwt;