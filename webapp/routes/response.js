

var Response = function(result){
	var status = 200;
	var errors = undefined;
	var result = result;
	
	var error = function(status_in, errors_in ){
		console.log('set error');
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

//console.log('**************************');
//console.log(new Response('ciao'));
//console.log(new Response().error(500,'pippo'));

module.exports = Response;