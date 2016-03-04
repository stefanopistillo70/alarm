


#include "BasicSensor.h"

//#define USE_SIGNATURE
//#define USE_BATTERY_METER


int BasicSensor::init() {
	Serial.println("##########  BasicSensor::init  ##########");

	checkCleanEEPROM();

#ifdef USE_SIGNATURE
		MyTransportNRF24 transport;

		// Hardware profile 
		MyHwATMega328 hw;

		uint8_t soft_serial[SHA204_SERIAL_SZ] = {0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09};
		/*whitelist_entry_t node_whitelist[] = {
		  { .nodeId = 0, // Just some value, this need to be changed to the NodeId of the trusted node
			.serial = {0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09} } // This need to change to the serial of the trusted node
		};
		MySigningAtsha204Soft signer(true,1,node_whitelist,soft_serial,MY_RANDOMSEED_PIN);
		*/
		MySigningAtsha204Soft signer(true, 0, NULL, soft_serial, MY_RANDOMSEED_PIN);

		gw = new MySensor(transport, hw, signer);
#else
		gw = new MySensor();
#endif

#ifdef USE_BATTERY_METER
		#if defined(__AVR_ATmega2560__)
			// use the 1.1 V internal reference
			analogReference(INTERNAL1V1);
		#else
			analogReference(INTERNAL);
		#endif
#endif

		//gw.begin();
		gw->begin(NULL, 7, false, AUTO);

#ifdef USE_SIGNATURE
		Serial.println("MySensor init (with signature)");
#else
		Serial.println("MySensor init");
#endif

		// Send the sketch version information to the gateway and Controller
		gw->sendSketchInfo("Battery Meter", "1.0");
		
		// Add interrupt for inclusion button to pin
		//PCintPort::attachInterrupt(cleanEEPROMPin, BasicSensor::pressButtonCleanEEPROM, RISING);

};




void BasicSensor::process() {
#ifdef USE_BATTERY_METER
	sendBatteryPower();
#endif
	processSensor(gw);
	gw->sleep(SLEEP_TIME);
};


#ifdef USE_BATTERY_METER
void BasicSensor::sendBatteryPower() {

	// get the battery Voltage
	int sensorValue = analogRead(BATTERY_SENSE_PIN);
	#ifdef DEBUG
	Serial.println(sensorValue);
	#endif

	// 1M, 470K divider across battery and using internal ADC ref of 1.1V
	// Sense point is bypassed with 0.1 uF cap to reduce noise at that point
	// ((1e6+470e3)/470e3)*1.1 = Vmax = 3.44 Volts
	// 3.44/1023 = Volts per bit = 0.003363075
	float batteryV  = sensorValue * 0.003363075;
	int batteryPcnt = sensorValue / 10;

	#ifdef DEBUG
	Serial.print("Battery Voltage: ");
	Serial.print(batteryV);
	Serial.println(" V");

	Serial.print("Battery percent: ");
	Serial.print(batteryPcnt);
	Serial.println(" %");
	#endif

	if (oldBatteryPcnt != batteryPcnt) {
		Serial.println("sending...");
		// Power up radio after sleep
		gw->sendBatteryLevel(batteryPcnt,true);
		oldBatteryPcnt = batteryPcnt;
	}

};
#endif





void BasicSensor::checkCleanEEPROM() {
	// set up the pin
	pinMode(cleanEEPROM_pin, INPUT);
	digitalWrite(cleanEEPROM_pin, HIGH);
	delay(20); // Just to get a solid reading on the pin

	if (!digitalRead(cleanEEPROM_pin)) {
		Serial.println("Started clearing. Please wait...");
		for (int i=0;i<512;i++) {
			EEPROM.write(i, 0xff);
		}
		Serial.println("Clering done. You're ready to go!");
	}
}
