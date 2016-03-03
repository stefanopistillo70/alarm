
#include <SPI.h>
#include <MySensor.h>
#include <MySigningAtsha204Soft.h>

#include "BasicSensor.h"


class TestSensor : public BasicSensor {
	unsigned long counter = 0;
	void processSensor(MySensor *gw);
};

static inline MyMessage& build (MyMessage &msg, uint8_t sender, uint8_t destination, uint8_t sensor, uint8_t command, uint8_t type, bool enableAck) {
	msg.sender = sender;
	msg.destination = destination;
	msg.sensor = sensor;
	msg.type = type;
	mSetCommand(msg,command);
	mSetRequestAck(msg,enableAck);
	mSetAck(msg,false);
	return msg;
}
void TestSensor::processSensor(MySensor *gw) {
	Serial.println("Sending counter ...");
	MyMessage msg;
	gw->sendRoute(build(msg, gw->getNodeId(), GATEWAY_ADDRESS, NODE_SENSOR_ID, C_INTERNAL, I_LOG_MESSAGE, true).set(counter));
	counter++;
	Serial.println("Msg Sent");
}

TestSensor sensor;


void setup() {
	Serial.println("##########  setup  ##########");
	sensor.init();
}

void loop() {
	sensor.process();
}
