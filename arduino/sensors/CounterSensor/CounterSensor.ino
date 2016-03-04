
#include <SPI.h>
#include <EEPROM.h>  
#include <MySensor.h>
#include <MySigningAtsha204Soft.h>
//#include <PinChangeInt.h>

#include "BasicSensor.h"



class TestSensor : public BasicSensor {
	unsigned long counter = 0;
	public:
	TestSensor(int cleanEEPROMPin_in , int batteryPin_in ) :  BasicSensor(cleanEEPROMPin_in, batteryPin_in){};
	void processSensor(MySensor * gw);
};


void TestSensor::processSensor(MySensor * gw) {
	Serial.println("Sending counter ...");
	int id = gw->getNodeId();
	MyMessage msg(id, V_TRIPPED);
	gw->send(msg.set(counter));
	counter++;
	Serial.println("Msg Sent");
}


TestSensor sensor(3,A0);


void setup() {
	Serial.println("##########  setup  ##########");
	sensor.init();
}

void loop() {
	sensor.process();
}
