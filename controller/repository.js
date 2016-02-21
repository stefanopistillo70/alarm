

var Repository = function() {
	
	this.nodes = [];
	this.zones = [];
	
	console.log('Repository init');
	
	this.checkForRemoteUpdate();
		
};

Repository.prototype.addNewNode = function(node_in){
		
		console.log("Node _in  ->"+node_in);
		
		function exists(element) {
			console.log("Element ->"+element);
			var ret = false;
			if(node_in.id === element.id) ret = true;
			else ret = false;
			console.log(ret);
			return ret;
		}

		var node = this.nodes.find(exists);
		
		console.log("Node ->"+node);
		
		if(node == undefined){
				console.log("Add new node ->"+node_in);
				this.nodes.push(node_in);
		}
};

Repository.prototype.checkForRemoteUpdate = function(){
	
	console.log('Start remote update');
	console.log(this);
	var nodesTmp = this.getNodes();
	if(nodesTmp != undefined){
		this.nodes = nodesTmp;
	}
	
	var zonesTmp = this.getNodes();
	if(zonesTmp != undefined){
		this.zones = zonesTmp;
	}
	
	setTimeout(Repository.prototype.checkForRemoteUpdate.bind(this),10000);
}

Repository.prototype.getNodes = function(){
	
}

Repository.prototype.getZones = function(){
	
}




module.exports = Repository; 




