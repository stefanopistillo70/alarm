
#ifndef NRF24BasicSensor_h
#define NRF24BasicSensor_h


#include <EEPROM.h>  
#include <MySensor.h>
#include <MySigningAtsha204Soft.h>



#define USE_SIGNATURE
#define USE_BATTERY_METER

const int CLEAN_EEPROM_PIN =  3;
const int BATTERY_SENSE_PIN = A0;
unsigned long SLEEP_TIME = 3000;  // sleep time between reads (seconds * 1000 milliseconds)
int oldBatteryPcnt = 0;
int cleanEEPROM_pin =  3;
int batteryPin = A0;

#ifdef USE_SIGNATURE
		MySensor gw(*new MyTransportNRF24(), *new MyHwATMega328(), *new MySigningAtsha204Soft(true, MY_RANDOMSEED_PIN));
#else
		MySensor gw(*new MyTransportNRF24(), *new MyHwATMega328(), *new MySigningNone());
#endif


#ifdef USE_BATTERY_METER
void sendBatteryPower() {

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
		gw.sendBatteryLevel(batteryPcnt);
		oldBatteryPcnt = batteryPcnt;
	}

};
#endif


void checkCleanEEPROM() {
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


void initBasic() {

		Serial.println("##########  BasicSensor::init  ##########");
		checkCleanEEPROM();

#ifdef USE_BATTERY_METER
		#if defined(__AVR_ATmega2560__)
			// use the 1.1 V internal reference
			analogReference(INTERNAL1V1);
		#else
			analogReference(INTERNAL);
		#endif
#endif
		gw.begin(NULL, AUTO, false, AUTO);

#ifdef USE_SIGNATURE
		Serial.println("MySensor init (with signature)");
#else
		Serial.println("MySensor init");
#endif
}


void processBasic() {
#ifdef USE_BATTERY_METER
	sendBatteryPower();
#endif
}


#endif
