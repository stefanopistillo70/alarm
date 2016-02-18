
var gateway = {}

gateway.Cmd = {
		MIN				: 0,
		C_PRESENTATION	: 0,
		C_SET			: 1,
		C_REQ			: 2,
		C_INTERNAL		: 3,
		C_STREAM		: 4,
		MAX				: 4
}

gateway.Cmd.toString = function(value) {
	switch (value) {
		case gateway.Cmd.C_PRESENTATION: 	return "C_PRESENTATION";
		case gateway.Cmd.C_SET: 			return "C_SET";
		case gateway.Cmd.C_REQ: 			return "C_REQ";
		case gateway.Cmd.C_INTERNAL: 		return "C_INTERNAL";
		case gateway.Cmd.C_STREAM: 			return "C_STREAM";
	}
}


gateway.GetSetType = {
	MIN				: 0,
	V_TEMP			: 0,
	V_HUM			: 1,
	V_LIGHT			: 2,
	V_DIMMER		: 3,
	V_FORECAST		: 5,
	V_PRESSURE		: 4,
	V_RAIN			: 6,
	V_RAINRATE		: 7,
	V_WIND			: 8,
	V_GUST			: 9,
	V_DIRECTION		: 10,
	V_UV			: 11,
	V_WEIGHT		: 12,
	V_DISTANCE		: 13,
	V_IMPEDANCE		: 14,
	V_ARMED			: 15,
	V_TRIPPED		: 16,
	V_WATT			: 17,
	V_KWH			: 18,
	V_SCENE_ON		: 19,
	V_SCENE_OFF		: 20,
	V_HEATER		: 21,
	V_HEATER_SW		: 22,
	V_LIGHT_LEVEL	: 23,
	V_VAR1			: 24,
	V_VAR2			: 25,
	V_VAR3			: 26,
	V_VAR4			: 27,
	V_VAR5			: 28,
	V_UP			: 29,
	V_DOWN			: 30,
	V_STOP			: 31,
	V_IR_SEND		: 32,
	V_IR_RECEIVE	: 33,
	V_FLOW			: 34,
	V_VOLUME		: 35,
	V_LOCK_STATUS	: 36,
	MAX				: 36
}

gateway.GetSetType.toString = function(value) {
	switch (value) {
		case gateway.GetSetType.V_TEMP: 		return "V_TEMP";
		case gateway.GetSetType.V_HUM: 			return "V_HUM";
		case gateway.GetSetType.V_LIGHT: 		return "V_LIGHT";
		case gateway.GetSetType.V_DIMMER: 		return "V_DIMMER";
		case gateway.GetSetType.V_FORECAST: 	return "V_FORECAST";
		case gateway.GetSetType.V_PRESSURE: 	return "V_PRESSURE";
		case gateway.GetSetType.V_RAIN: 		return "V_RAIN";
		case gateway.GetSetType.V_RAINRATE: 	return "V_RAINRATE";
		case gateway.GetSetType.V_WIND: 		return "V_WIND";
		case gateway.GetSetType.V_GUST: 		return "V_GUST";
		case gateway.GetSetType.V_DIRECTION: 	return "V_DIRECTION";
		case gateway.GetSetType.V_UV: 			return "V_UV";
		case gateway.GetSetType.V_WEIGHT:		return "V_WEIGHT";
		case gateway.GetSetType.V_DISTANCE: 	return "V_DISTANCE";
		case gateway.GetSetType.V_IMPEDANCE: 	return "V_IMPEDANCE";
		case gateway.GetSetType.V_ARMED: 		return "V_ARMED";
		case gateway.GetSetType.V_TRIPPED: 		return "V_TRIPPED";
		case gateway.GetSetType.V_WATT: 		return "V_WATT";
		case gateway.GetSetType.V_KWH: 			return "V_KWH";
		case gateway.GetSetType.V_SCENE_ON: 	return "V_SCENE_ON";
		case gateway.GetSetType.V_SCENE_OFF: 	return "V_SCENE_OFF";
		case gateway.GetSetType.V_HEATER: 		return "V_HEATER";
		case gateway.GetSetType.V_HEATER_SW: 	return "V_HEATER_SW";
		case gateway.GetSetType.V_LIGHT_LEVEL: 	return "V_LIGHT_LEVEL";
		case gateway.GetSetType.V_VAR1: 		return "V_VAR1";
		case gateway.GetSetType.V_VAR2: 		return "V_VAR2";
		case gateway.GetSetType.V_VAR3: 		return "V_VAR3";
		case gateway.GetSetType.V_VAR4: 		return "V_VAR4";
		case gateway.GetSetType.V_VAR5: 		return "V_VAR5";
		case gateway.GetSetType.V_UP: 			return "V_UP";
		case gateway.GetSetType.V_DOWN: 		return "V_DOWN";
		case gateway.GetSetType.V_STOP: 		return "V_STOP";
		case gateway.GetSetType.V_IR_SEND: 		return "V_IR_SEND";
		case gateway.GetSetType.V_IR_RECEIVE: 	return "V_IR_RECEIVE";
		case gateway.GetSetType.V_FLOW: 		return "V_FLOW";
		case gateway.GetSetType.V_VOLUME: 		return "V_VOLUME";
		case gateway.GetSetType.V_LOCK_STATUS: 	return "V_LOCK_STATUS";
	}
}


gateway.InternalType = {
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
		MAX					: 13
}

gateway.InternalType.toString = function(value) {
	switch (value) {
		case gateway.InternalType.I_BATTERY_LEVEL: 	return "I_BATTERY_LEVEL";
		case gateway.InternalType.I_TIME: 			return "I_TIME";
		case gateway.InternalType.I_VERSION: 		return "I_VERSION";
		case gateway.InternalType.I_ID_REQUEST: 	return "I_ID_REQUEST";
		case gateway.InternalType.I_ID_RESPONSE: 	return "I_ID_RESPONSE";
		case gateway.InternalType.I_INCLUSION_MODE: return "I_INCLUSION_MODE";
		case gateway.InternalType.I_CONFIG: 		return "I_CONFIG";
		case gateway.InternalType.I_PING: 			return "I_PING";
		case gateway.InternalType.I_PING_ACK: 		return "I_PING_ACK";
		case gateway.InternalType.I_LOG_MESSAGE: 	return "I_LOG_MESSAGE";
		case gateway.InternalType.I_CHILDREN: 		return "I_CHILDREN";
		case gateway.InternalType.I_SKETCH_NAME: 	return "I_SKETCH_NAME";
		case gateway.InternalType.I_SKETCH_VERSION: return "I_SKETCH_VERSION";
		case gateway.InternalType.I_REBOOT: 		return "I_REBOOT";
	}
}


gateway.SensorType = {
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
		MAX						: 22
}

gateway.SensorType.toString = function(value) {
	switch (value) {
		case gateway.SensorType.S_DOOR: 					return "S_DOOR";
		case gateway.SensorType.S_MOTION: 					return "S_MOTION";
		case gateway.SensorType.S_SMOKE: 					return "S_SMOKE";
		case gateway.SensorType.S_LIGHT: 					return "S_LIGHT";
		case gateway.SensorType.S_DIMMER: 					return "S_DIMMER";
		case gateway.SensorType.S_COVER: 					return "S_COVER";
		case gateway.SensorType.S_TEMP: 					return "S_TEMP";
		case gateway.SensorType.S_HUM: 						return "S_HUM";
		case gateway.SensorType.S_BARO: 					return "S_BARO";
		case gateway.SensorType.S_WIND: 					return "S_WIND";
		case gateway.SensorType.S_RAIN: 					return "S_RAIN";
		case gateway.SensorType.S_UV: 						return "S_UV";
		case gateway.SensorType.S_WEIGHT: 					return "S_WEIGHT";
		case gateway.SensorType.S_POWER: 					return "S_POWER";
		case gateway.SensorType.S_HEATER: 					return "S_HEATER";
		case gateway.SensorType.S_DISTANCE: 				return "S_DISTANCE";
		case gateway.SensorType.S_LIGHT_LEVEL: 				return "S_LIGHT_LEVEL";
		case gateway.SensorType.S_ARDUINO_NODE: 			return "S_ARDUINO_NODE";
		case gateway.SensorType.S_ARDUINO_REPEATER_NODE: 	return "S_ARDUINO_REPEATER_NODE";
		case gateway.SensorType.S_LOCK: 					return "S_LOCK";
		case gateway.SensorType.S_IR: 						return "S_IR";
		case gateway.SensorType.S_WATER: 					return "S_WATER";
		case gateway.SensorType.S_AIR_QUALITY: 				return "S_AIR_QUALITY";
	}
}



gateway.parseMsg = function(data) {
	var datas = data.toString().split(";");
	var sender = +datas[0];
	var sensor = +datas[1];
	var command = +datas[2];
	var ack = +datas[3];
	var type = +datas[4];
	var rawpayload="";
	if (datas[5]) {
		rawpayload = datas[5].trim();
	}
	return new gateway.Msg(sender, sensor, command, ack, type, rawpayload);
}

	
	
gateway.Msg = function(sender, sensor, command, ack, type, rawpayload) {
		this.sender = sender;
		this.sensor = sensor;
		this.command = command;
		this.ack = ack;
		this.type = type;
		this.rawpayload = rawpayload;
		
		this.toString = function() {
			var sType = "";
			if (command == gateway.Cmd.C_PRESENTATION) sType = gateway.SensorType.toString(type);
			else if (command == gateway.Cmd.C_INTERNAL) sType = gateway.InternalType.toString(type);
			else if ((command == gateway.Cmd.C_SET) || (command == gateway.Cmd.C_REQ)) sType = gateway.GetSetType.toString(type);
			return "Msg from node: " + sender + ", sensor child: " + sensor + ", command: " + gateway.Cmd.toString(command) + ", ack: " + ack + ", type: " + sType + ", payload: " + rawpayload;
		}
		
		//check command rang
		if ((command < gateway.Cmd.MIN ) || (command > gateway.Cmd.MAX )) throw new Error("Wrong Command Value : " + command);
		
		//check command  sub-type  correlation
		if ( command  == gateway.Cmd.C_PRESENTATION ) {
			if ( (type < gateway.SensorType.MIN ) || (type > gateway.SensorType.MAX )) throw new Error("Wrong correlation commnad  : " + command + "   sensor type : " + type);
		} else if ( (command  == gateway.Cmd.C_SET) || (command  == gateway.Cmd.C_GET) ) {
			
		} else if ( command  == gateway.Cmd.C_INTERNAL) {
			if ( (type < gateway.InternalType.MIN ) || (type < gateway.InternalType.MAX )) throw new Error("Wrong correlation commnad  : " + command + "   internal type : " + type);
		} else {
			throw new Error("Wrong correlation commnad  : " + command + "   type : " + type);
		}
}


module.exports = gateway;


