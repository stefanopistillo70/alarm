
#ifndef BasicSensor_h
#define BasicSensor_h


class BasicSensor {
	public:
	
		BasicSensor(int cleanEEPROMPin_in = 3, int batteryPin_in = A0) : cleanEEPROMPin(cleanEEPROMPin_in), batteryPin(batteryPin_in){
			
		};

		int init();

		void process();

	private:

	const int CLEAN_EEPROM_PIN =  3;
	const int BATTERY_SENSE_PIN = A0;
	unsigned long SLEEP_TIME = 3000;  // sleep time between reads (seconds * 1000 milliseconds)
	int oldBatteryPcnt = 0;
	MySensor *gw;
	
	int cleanEEPROMPin =  3;
	int batteryPin = A0;
	
	static boolean buttonClearEEprom; 

	
	void sendBatteryPower();
	
	static void pressButtonCleanEEPROM(){
		buttonClearEEprom = true;
	}
	
	void cleanEEPROM();

protected:

	virtual void processSensor(MySensor *gw);

};

#endif
