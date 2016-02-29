var express = require('express');
var router = express.Router();


var SensorLog = function(id_in, status_in){
		this.id = id_in;
		this.status = status_in;
	
};


/* GET SensorLog listing. */
router.get('/', function(req, res, next) {
  var sensorLogArray = [new SensorLog(0,'aperto'), new SensorLog(1,'chiuso')];
  res.json(sensorLogArray);
});

module.exports = router;
