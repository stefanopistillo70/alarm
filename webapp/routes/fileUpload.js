var express = require('express');
var router = express.Router();

var logger = require('../config/logger.js')('User');


var fs = require('fs');


/* GET Users listing. */
router.get('/', function(req, res, next) {
	
	var locations = req.locations.split("#");
	
	logger.info("User get list for location : "+locations);
	query = { locations : {$elemMatch: { _id : locations}}};
	
	User.find(query, function(err, users) {
				if (err){
					res.status(400).send(err);
				}else{
					var resultUser = [];
					for (i = 0; i < users.length; i++) { 
								resultUser[i] = {};
								resultUser[i].email = users[i].auth.local.email;
					}
					res.json(new Response(resultUser));
				} 
	});	
});


router.post('/', function(req, res, next){
  
	logger.info("FILE UPLOAD");
	
	var date = (new Date()).getTime();
	var fileName = "public/stream/cam-"+date+".mp4";
	
	const writer = fs.createWriteStream(fileName);
	writer.on('pipe', (src) => {
	  logger.info("something is piping into the writer");
	});
	
	req.pipe( writer
	
	  /*gfs.createWriteStream({
		filename: 'test'
	  }).on('close', function(savedFile){
		console.log('file saved', savedFile);
		return res.json({file: savedFile});
	  })
	  */
	).on('close', function(){
		logger.info("FILE saved");
		return res.send("File saved");
	  });

});



module.exports = router;
