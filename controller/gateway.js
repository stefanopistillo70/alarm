








const V_TEMP						= 0;
const V_HUM							= 1;
const V_LIGHT						= 2;
const V_DIMMER						= 3;
const V_PRESSURE					= 4;
const V_FORECAST					= 5;
const V_RAIN						= 6;
const V_RAINRATE					= 7;
const V_WIND						= 8;
const V_GUST						= 9;
const V_DIRECTION					= 10;
const V_UV							= 11;
const V_WEIGHT						= 12;
const V_DISTANCE					= 13;
const V_IMPEDANCE					= 14;
const V_ARMED						= 15;
const V_TRIPPED						= 16;
const V_WATT						= 17;
const V_KWH							= 18;
const V_SCENE_ON					= 19;
const V_SCENE_OFF					= 20;
const V_HEATER						= 21;
const V_HEATER_SW					= 22;
const V_LIGHT_LEVEL					= 23;
const V_VAR1						= 24;
const V_VAR2						= 25;
const V_VAR3						= 26;
const V_VAR4						= 27;
const V_VAR5						= 28;
const V_UP							= 29;
const V_DOWN						= 30;
const V_STOP						= 31;
const V_IR_SEND						= 32;
const V_IR_RECEIVE					= 33;
const V_FLOW						= 34;
const V_VOLUME						= 35;
const V_LOCK_STATUS					= 36;

const I_BATTERY_LEVEL				= 0;
const I_TIME						= 1;
const I_VERSION						= 2;
const I_ID_REQUEST					= 3;
const I_ID_RESPONSE					= 4;
const I_INCLUSION_MODE				= 5;
const I_CONFIG						= 6;
const I_PING						= 7;
const I_PING_ACK					= 8;
const I_LOG_MESSAGE					= 9;
const I_CHILDREN					= 10;
const I_SKETCH_NAME					= 11;
const I_SKETCH_VERSION				= 12;
const I_REBOOT						= 13;





var gateway = {
	
	Cmd : {
		C_PRESENTATION	: 0,
		C_SET			: 1,
		C_REQ			: 2,
		C_INTERNAL		: 3,
		C_STREAM		: 4
	},
	
	SensorType : {
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
	},
	
	Msg : function(sender, sensor, command, ack, type, rawpayload){
		this.sender = sender;
		this.sensor = sensor;
		this.command = command;
		this.ack = ack;
		this.type = type;
		this.rawpayload = rawpayload;
		
		if ((command < 0) ||(command > 4 )) throw new Error("Wrong Command Value : "+command);
		
	},
	
	parseMsg : function(data){
		
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
		
		return new Msg(sender, sensor, command, ack, type, rawpayload);
	}
	
}