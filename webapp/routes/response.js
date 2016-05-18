

var Response = function(result){
	var status = 200;
	var errors = undefined;
	var result = result;
	
	var error = function(status_in, errors_in ){
		this.status = status_in;
		this.errors = errors_in;
	
		return this;
	}
	
	if(result){
		
		var res = {
			status : status,
			result : result,
			error : error
		}
		
		return res;
	}else{
		var res = {
			status : status,
			error : error
		}
		
		return res;	
	}
};

module.exports = Response;