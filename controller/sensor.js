
var Sensor = function(id, name) {  

    this.id = id;
	this.name = name;
	this.status = "";
		
	this.init = function() {
		console.log('init new Sensor -> ' + this.id + ' - ' + this.name);
	}
	

	this.init();
}
