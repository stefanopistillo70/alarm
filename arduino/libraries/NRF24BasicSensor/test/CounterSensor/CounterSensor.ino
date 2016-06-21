
#include <SPI.h>
#include <EEPROM.h>  
#include <MySensor.h>
#include <MySigningAtsha204Soft.h>
#include <PinChangeInt.h>

#include "NRF24BasicSensor.h"

unsigned long counter = 0;

void processSensor() {
	Serial.println("Sending counter ...");
	int id = gw.getNodeId();
	MyMessage msg(id, V_TRIPPED);
	gw.send(msg.set(counter));
	counter++;
	Serial.println("Msg Sent");
}

void setup() {
	Serial.begin(115200);
	Serial.println("##########  setup  ##########");
	initBasic();
}

void loop() {
	processBasic();
	processSensor();
	gw.sleep(SLEEP_TIME);
}
