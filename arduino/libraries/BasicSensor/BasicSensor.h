
#ifndef BasicSensor_h
#define BasicSensor_h


#include <EEPROM.h>  
#include <MySensor.h>
#include <MySigningAtsha204Soft.h>

class BasicSensor {
	public:
	
		BasicSensor(int cleanEEPROMPin_in = 3, int batteryPin_in = A0) : cleanEEPROM_pin(cleanEEPROMPin_in), batteryPin(batteryPin_in) {
		};

		int init();

		void process();

	private:

	const int CLEAN_EEPROM_PIN =  3;
	const int BATTERY_SENSE_PIN = A0;
	unsigned long SLEEP_TIME = 3000;  // sleep time between reads (seconds * 1000 milliseconds)
	int oldBatteryPcnt = 0;
	MySensor *gw;
	
	int cleanEEPROM_pin =  3;

	int batteryPin = A0;
	
	
	void sendBatteryPower();
	
	void checkCleanEEPROM();

protected:

	virtual void processSensor(MySensor *gw);

};

#endif
