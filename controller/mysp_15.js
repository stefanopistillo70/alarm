
var logger = require('./logger.js')('MSP15');
var Repository = require('./repository.js');

var MYSP_15 = function(repository) {
			
			
		this.onMsg = function(rd,callback){
			
			
			var msg = msgBuilder(rd.toString());
			if (msg.type != undefined){
				
				var replayMsg;
				
				switch(msg.command) {
					/*******************
					* 	PRESENTATION
					********************/
					case Cmd.C_PRESENTATION:
						switch(msg.type) {
							case SensorType.S_ARDUINO_NODE:
								logger.info("Presentation from devideId : "+msg.sender+" sensorId : "+msg.sensor);
								var device = repository.getDevice(msg.sender);
								if(device == undefined){
									repository.buildNewDevice("NRF24", msg.sender, function(device,err){
										if(err){
											logger.error(err);
										}
										logger.info("device created");
										callback();
									});
								}								
								break;
							case SensorType.S_TEMP:
							case SensorType.S_HUM:
							
								var sensType = "";
								if(msg.type == SensorType.S_HUM) sensType = "Humidity";
								else sensType = "Temperature";
								logger.info("Presentation from deviceId : "+msg.sender+" sensorId : "+msg.sensor);
								
								var sen = { id : msg.sensor, type : sensType};
								
								var device = repository.getDevice(msg.sender);
								if(device == undefined){
									logger.info("undefined device create new");
									repository.buildNewDevice("NRF24", msg.sender, function(device,err){
										if(err){
											logger.error(err);
											callback();
										}else{
											repository.addSensor(device.id, sen, function(device, err){
												if(err){
													logger.error(err);
													callback();
												}else{
													logger.info("sensor created");
													callback();
												}
											});
										};
									});
								}else{
									var sensor = repository.getSensor(device, msg.sensor);
									if(sensor == undefined){
										logger.info("undefined sensor create new");
										repository.addSensor(device.id, sen, function(device, err){
											if(err){
												logger.error(err);
												callback();
											}else{
												logger.info("sensor created");
												callback();
											};
										});
									};
								};								
								break;

							default:
								logger.info("Unsupported type : " + msg.type);
								callback();
								break;
						}
							
						break;
						
						
					/*******************
					* 	SET
					********************/
					case Cmd.C_SET:
						switch(msg.type) {
							case GetSetType.V_TEMP:
								repository.setSensorValue(msg.sender,msg.sensor,msg.payload, function(){
									callback();
								});
								break;
							case GetSetType.V_HUM:
								repository.setSensorValue(msg.sender,msg.sensor,msg.payload, function(){
									callback();
								});
								break;
							case GetSetType.V_WATT:
								callback();
								break;
							default:
								logger.info("Unsupported type : " + msg.type);
								callback();
								break;
						}
						break;
						
						
					/*******************
					* 	INTERNAL
					********************/						
					case Cmd.C_INTERNAL:
						
						switch(msg.type) {
							
							case InternalType.I_BATTERY_LEVEL: 
								repository.setBatteryLevel(msg.sender,msg.rawpayload, function(device,err){
									callback();
								});
								break;
							case InternalType.I_ID_REQUEST:
								var device = repository.getDevice(msg.sender);
								if(device == undefined){
									repository.buildNewDevice("NRF24", "", function(device,err){
										if(err){
											logger.error(err);
											callback();
										}
										
										if(device){
											replayMsg = new Msg(255,255,Cmd.C_INTERNAL,0,InternalType.I_ID_RESPONSE,device.id);
											if(replayMsg){
												logger.info('SENDING REPLAY -> '+replayMsg.stringify());
												callback(replayMsg.stringify());
											}else callback();
										}
									});
								}else{
									replayMsg = new Msg(255,255,Cmd.C_INTERNAL,0,InternalType.I_ID_RESPONSE,device.id);
									if(replayMsg){
										logger.info('SENDING REPLAY -> '+replayMsg.stringify());
										callback(replayMsg.stringify());
									}else callback();
								}
								break;
							case InternalType.I_CONFIG:
								callback();
								break;
							case InternalType.I_LOG_MESSAGE:
								callback();
								break;
							case InternalType.I_SKETCH_NAME:
								callback();
								break;
							case InternalType.I_SKETCH_VERSION:
								callback();
								break;
							case InternalType.I_GATEWAY_READY:
								callback();
								break;
							default:
								logger.info("Unsupported type : " + msg.type);
								callback();
								break;
						}
					
						break;
						
					default:
						logger.info("Unsupported command : " + msg.command);
						callback();
						break;
				};	
			}else{
				logger.info("MSG ->"+msg);
				callback();
			}			
		};
};


Cmd = {
		MIN				: 0,
		C_PRESENTATION	: 0,
		C_SET			: 1,
		C_REQ			: 2,
		C_INTERNAL		: 3,
		C_STREAM		: 4,
		MAX				: 4
}

Cmd.toString = function(value) {
	switch (value) {
		case Cmd.C_PRESENTATION: 	return "C_PRESENTATION";
		case Cmd.C_SET: 			return "C_SET";
		case Cmd.C_REQ: 			return "C_REQ";
		case Cmd.C_INTERNAL: 		return "C_INTERNAL";
		case Cmd.C_STREAM: 			return "C_STREAM";
	}
}


GetSetType = {
	MIN						: 0,
	V_TEMP					: 0,
	V_HUM					: 1,
	V_LIGHT					: 2,
	V_DIMMER				: 3,
	V_FORECAST				: 5,
	V_PRESSURE				: 4,
	V_RAIN					: 6,
	V_RAINRATE				: 7,
	V_WIND					: 8,
	V_GUST					: 9,
	V_DIRECTION				: 10,
	V_UV					: 11,
	V_WEIGHT				: 12,
	V_DISTANCE				: 13,
	V_IMPEDANCE				: 14,
	V_ARMED					: 15,
	V_TRIPPED				: 16,
	V_WATT					: 17,
	V_KWH					: 18,
	V_SCENE_ON				: 19,
	V_SCENE_OFF				: 20,
	V_HEATER				: 21,
	V_HEATER_SW				: 22,
	V_LIGHT_LEVEL			: 23,
	V_VAR1					: 24,
	V_VAR2					: 25,
	V_VAR3					: 26,
	V_VAR4					: 27,
	V_VAR5					: 28,
	V_UP					: 29,
	V_DOWN					: 30,
	V_STOP					: 31,
	V_IR_SEND				: 32,
	V_IR_RECEIVE			: 33,
	V_FLOW					: 34,
	V_VOLUME				: 35,
	V_LOCK_STATUS			: 36,
	V_LEVEL					: 37,
	V_VOLTAGE				: 38,
	V_CURRENT				: 39,
	V_RGB					: 40,
	V_RGBW					: 41,
	V_ID    				: 42,
	V_UNIT_PREFIX			: 43,
	V_HVAC_SETPOINT_COOL	: 44,
	V_HVAC_SETPOINT_HEAT	: 45,
	V_HVAC_FLOW_MODE		: 46,
	MAX						: 46
}

GetSetType.toString = function(value) {
	switch (value) {
		case GetSetType.V_TEMP: 				return "V_TEMP";
		case GetSetType.V_HUM: 					return "V_HUM";
		case GetSetType.V_LIGHT: 				return "V_LIGHT";
		case GetSetType.V_DIMMER: 				return "V_DIMMER";
		case GetSetType.V_FORECAST: 			return "V_FORECAST";
		case GetSetType.V_PRESSURE: 			return "V_PRESSURE";
		case GetSetType.V_RAIN: 				return "V_RAIN";
		case GetSetType.V_RAINRATE: 			return "V_RAINRATE";
		case GetSetType.V_WIND: 				return "V_WIND";
		case GetSetType.V_GUST: 				return "V_GUST";
		case GetSetType.V_DIRECTION: 			return "V_DIRECTION";
		case GetSetType.V_UV: 					return "V_UV";
		case GetSetType.V_WEIGHT:				return "V_WEIGHT";
		case GetSetType.V_DISTANCE: 			return "V_DISTANCE";
		case GetSetType.V_IMPEDANCE: 			return "V_IMPEDANCE";
		case GetSetType.V_ARMED: 				return "V_ARMED";
		case GetSetType.V_TRIPPED: 				return "V_TRIPPED";
		case GetSetType.V_WATT: 				return "V_WATT";
		case GetSetType.V_KWH: 					return "V_KWH";
		case GetSetType.V_SCENE_ON: 			return "V_SCENE_ON";
		case GetSetType.V_SCENE_OFF: 			return "V_SCENE_OFF";
		case GetSetType.V_HEATER: 				return "V_HEATER";
		case GetSetType.V_HEATER_SW: 			return "V_HEATER_SW";
		case GetSetType.V_LIGHT_LEVEL: 			return "V_LIGHT_LEVEL";
		case GetSetType.V_VAR1: 				return "V_VAR1";
		case GetSetType.V_VAR2: 				return "V_VAR2";
		case GetSetType.V_VAR3: 				return "V_VAR3";
		case GetSetType.V_VAR4: 				return "V_VAR4";
		case GetSetType.V_VAR5: 				return "V_VAR5";
		case GetSetType.V_UP: 					return "V_UP";
		case GetSetType.V_DOWN: 				return "V_DOWN";
		case GetSetType.V_STOP: 				return "V_STOP";
		case GetSetType.V_IR_SEND: 				return "V_IR_SEND";
		case GetSetType.V_IR_RECEIVE: 			return "V_IR_RECEIVE";
		case GetSetType.V_FLOW: 				return "V_FLOW";
		case GetSetType.V_VOLUME: 				return "V_VOLUME";
		case GetSetType.V_LOCK_STATUS: 			return "V_LOCK_STATUS";
		case GetSetType.V_LEVEL:				return "V_LEVEL";
		case GetSetType.V_VOLTAGE:				return "V_VOLTAGE";
		case GetSetType.V_CURRENT:				return "V_CURRENT";
		case GetSetType.V_RGB:					return "V_RGB";
		case GetSetType.V_RGBW:					return "V_RGBW";
		case GetSetType.V_ID:    				return "V_ID";
		case GetSetType.V_UNIT_PREFIX:			return "V_UNIT_PREFIX";
		case GetSetType.V_HVAC_SETPOINT_COOL:	return "V_HVAC_SETPOINT_COOL";
		case GetSetType.V_HVAC_SETPOINT_HEAT:	return "V_HVAC_SETPOINT_HEAT";
		case GetSetType.V_HVAC_FLOW_MODE:		return "V_HVAC_FLOW_MODE";
	}
}


InternalType = {
		MIN					: 0,
		I_BATTERY_LEVEL		: 0,
		I_TIME				: 1,
		I_VERSION			: 2,
		I_ID_REQUEST		: 3,
		I_ID_RESPONSE		: 4,
		I_INCLUSION_MODE	: 5,
		I_CONFIG			: 6,
		I_PING				: 7,
		I_PING_ACK			: 8,
		I_LOG_MESSAGE		: 9,
		I_CHILDREN			: 10,
		I_SKETCH_NAME		: 11,
		I_SKETCH_VERSION	: 12,
		I_REBOOT			: 13,
		I_GATEWAY_READY		: 14,
		I_REQUEST_SIGNING	: 15,
		I_GET_NONCE			: 16,
		I_GET_NONCE_RESPONSE: 17,
		MAX					: 17
}

InternalType.toString = function(value) {
	switch (value) {
		case InternalType.I_BATTERY_LEVEL: 		return "I_BATTERY_LEVEL";
		case InternalType.I_TIME: 				return "I_TIME";
		case InternalType.I_VERSION: 			return "I_VERSION";
		case InternalType.I_ID_REQUEST: 		return "I_ID_REQUEST";
		case InternalType.I_ID_RESPONSE: 		return "I_ID_RESPONSE";
		case InternalType.I_INCLUSION_MODE: 	return "I_INCLUSION_MODE";
		case InternalType.I_CONFIG: 			return "I_CONFIG";
		case InternalType.I_PING: 				return "I_PING";
		case InternalType.I_PING_ACK: 			return "I_PING_ACK";
		case InternalType.I_LOG_MESSAGE: 		return "I_LOG_MESSAGE";
		case InternalType.I_CHILDREN: 			return "I_CHILDREN";
		case InternalType.I_SKETCH_NAME: 		return "I_SKETCH_NAME";
		case InternalType.I_SKETCH_VERSION: 	return "I_SKETCH_VERSION";
		case InternalType.I_REBOOT: 			return "I_REBOOT";
		case InternalType.I_GATEWAY_READY: 		return "I_GATEWAY_READY";
		case InternalType.I_REQUEST_SIGNING: 	return "I_REQUEST_SIGNING";
		case InternalType.I_GET_NONCE: 			return "I_GET_NONCE";
		case InternalType.I_GET_NONCE_RESPONSE: return "I_GET_NONCE_RESPONSE";
	}
}


SensorType = {
		MIN						: 0,
		S_DOOR					: 0,
		S_MOTION				: 1,
		S_SMOKE					: 2,
		S_LIGHT					: 3,
		S_DIMMER				: 4,
		S_COVER					: 5,
		S_TEMP					: 6,
		S_HUM					: 7,
		S_BARO					: 8,
		S_WIND					: 9,
		S_RAIN					: 10,
		S_UV					: 11,
		S_WEIGHT				: 12,
		S_POWER					: 13,
		S_HEATER				: 14,
		S_DISTANCE				: 15,
		S_LIGHT_LEVEL			: 16,
		S_ARDUINO_NODE			: 17,
		S_ARDUINO_REPEATER_NODE	: 18,
		S_LOCK					: 19,
		S_IR					: 20,
		S_WATER					: 21,
		S_AIR_QUALITY			: 22,
		S_CUSTOM				: 23,
		S_DUST					: 24,
		S_SCENE_CONTROLLER		: 25,
		S_RGB_LIGHT				: 26,
		S_RGBW_LIGHT			: 27,
		S_COLOR_SENSOR			: 28,
		S_HVAC					: 29,
		S_MULTIMETER			: 30,
		S_SPRINKLER				: 31,
		S_WATER_LEAK			: 32,
		S_SOUND					: 33,
		S_VIBRATION				: 34,
		S_MOISTURE				: 35,
		MAX						: 35
}

SensorType.toString = function(value) {
	switch (value) {
		case SensorType.S_DOOR: 					return "S_DOOR";
		case SensorType.S_MOTION: 					return "S_MOTION";
		case SensorType.S_SMOKE: 					return "S_SMOKE";
		case SensorType.S_LIGHT: 					return "S_LIGHT";
		case SensorType.S_DIMMER: 					return "S_DIMMER";
		case SensorType.S_COVER: 					return "S_COVER";
		case SensorType.S_TEMP: 					return "S_TEMP";
		case SensorType.S_HUM: 						return "S_HUM";
		case SensorType.S_BARO: 					return "S_BARO";
		case SensorType.S_WIND: 					return "S_WIND";
		case SensorType.S_RAIN: 					return "S_RAIN";
		case SensorType.S_UV: 						return "S_UV";
		case SensorType.S_WEIGHT: 					return "S_WEIGHT";
		case SensorType.S_POWER: 					return "S_POWER";
		case SensorType.S_HEATER: 					return "S_HEATER";
		case SensorType.S_DISTANCE: 				return "S_DISTANCE";
		case SensorType.S_LIGHT_LEVEL: 				return "S_LIGHT_LEVEL";
		case SensorType.S_ARDUINO_NODE: 			return "S_ARDUINO_NODE";
		case SensorType.S_ARDUINO_REPEATER_NODE: 	return "S_ARDUINO_REPEATER_NODE";
		case SensorType.S_LOCK: 					return "S_LOCK";
		case SensorType.S_IR: 						return "S_IR";
		case SensorType.S_WATER: 					return "S_WATER";
		case SensorType.S_AIR_QUALITY: 				return "S_AIR_QUALITY";
		case SensorType.S_CUSTOM:					return "S_CUSTOM";
		case SensorType.S_DUST:						return "S_DUST";
		case SensorType.S_SCENE_CONTROLLER:			return "S_SCENE_CONTROLLER";
		case SensorType.S_RGB_LIGHT:				return "S_RGB_LIGHT";
		case SensorType.S_RGBW_LIGHT:				return "S_RGBW_LIGHT";
		case SensorType.S_COLOR_SENSOR:				return "S_COLOR_SENSOR";
		case SensorType.S_HVAC:						return "S_HVAC";
		case SensorType.S_MULTIMETER:				return "S_MULTIMETER";
		case SensorType.S_SPRINKLER:				return "S_SPRINKLER";
		case SensorType.S_WATER_LEAK:				return "S_WATER_LEAK";
		case SensorType.S_SOUND:					return "S_SOUND";
		case SensorType.S_VIBRATION:				return "S_VIBRATION";
		case SensorType.S_MOISTURE:					return "S_MOISTURE";
		
	}
}


StreamType = {
		MIN								: 0,
		ST_FIRMWARE_CONFIG_REQUEST		: 0,
		ST_FIRMWARE_CONFIG_RESPONSE		: 1,
		ST_FIRMWARE_REQUEST				: 2,
		ST_FIRMWARE_RESPONSE			: 3,
		ST_SOUND						: 4,
		ST_IMAGE						: 5,
		MAX								: 5
}

StreamType.toString = function(value) {
	switch (value) {
		case StreamType.ST_FIRMWARE_CONFIG_REQUEST: 	return "ST_FIRMWARE_CONFIG_REQUEST";
		case StreamType.ST_FIRMWARE_CONFIG_RESPONSE: 	return "ST_FIRMWARE_CONFIG_RESPONSE";
		case StreamType.ST_FIRMWARE_REQUEST: 			return "ST_FIRMWARE_REQUEST";
		case StreamType.ST_FIRMWARE_RESPONSE: 			return "ST_FIRMWARE_RESPONSE";
		case StreamType.ST_SOUND: 						return "ST_SOUND";
		case StreamType.ST_IMAGE: 						return "ST_IMAGE";
	}
}


	
Msg = function(sender, sensor, command, ack, type, rawpayload) {
		this.sender = sender;
		this.sensor = sensor;
		this.command = command;
		this.ack = ack;
		this.type = type;
		this.rawpayload = rawpayload;
		
		this.toString = function() {
			var sType = "";
			if (command == Cmd.C_PRESENTATION) sType = SensorType.toString(type);
			else if (command == Cmd.C_INTERNAL) sType = InternalType.toString(type);
			else if ((command == Cmd.C_SET) || (command == Cmd.C_REQ)) sType = GetSetType.toString(type);
			return "Msg from node: " + sender + ", sensor child: " + sensor + ", command: " + Cmd.toString(command) + ", ack: " + ack + ", type: " + sType + ", payload: " + rawpayload;
		}
		
		//check command rang
		if ((command < Cmd.MIN ) || (command > Cmd.MAX )) throw new Error("Wrong Command Value : " + command);
		
		//check command  sub-type  correlation
		if ( command  == Cmd.C_PRESENTATION ) {
			if ( (type < SensorType.MIN ) || (type > SensorType.MAX )) throw new Error("Wrong correlation commnad  : " + command + "   sensor type : " + type);
		} else if ( (command  == Cmd.C_SET) || (command  == Cmd.C_GET) ) {
			
		} else if ( command  == Cmd.C_INTERNAL) {
			if ( (type < InternalType.MIN ) || (type > InternalType.MAX )) throw new Error("Wrong correlation commnad  : " + command + "   internal type : " + type);
		} else {
			throw new Error("Wrong correlation commnad  : " + command + "   type : " + type);
		}
		
		
		
}


var msgBuilder = function(data) {
			var datas = data.toString().split(";");
			if(datas.length > 5){
				var sender = +datas[0];
				var sensor = +datas[1];
				var command = +datas[2];
				var ack = +datas[3];
				var type = +datas[4];
				var rawpayload="";
				if (datas[5]) {
					rawpayload = datas[5].trim();
				}
				return new Msg(sender, sensor, command, ack, type, rawpayload);
			}else return data;
			
		}


Msg.prototype.stringify = function(){
	return this.sender +';'+ this.sensor +';'+ this.command +';'+ this.ack +';'+ this.type +';'+ this.rawpayload;
}


module.exports = MYSP_15;


