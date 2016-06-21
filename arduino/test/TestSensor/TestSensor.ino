
#include <SPI.h>
#include <MySensor.h>
#include <MySigningAtsha204Soft.h>

#include "BasicSensor.h"


class TestSensor : public BasicSensor {
	void processSensor(MySensor *gw);
};

void TestSensor::processSensor(MySensor *gw) {
}

TestSensor sensor;


void setup() {
	Serial.println("##########  setup  ##########");
	sensor.init();
}

void loop() {
	sensor.process();
}
