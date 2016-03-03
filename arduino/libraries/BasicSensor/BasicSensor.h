
#ifndef BasicSensor_h
#define BasicSensor_h

class BasicSensor {
	public:

		int init();

		void process();

	private:

	const int BATTERY_SENSE_PIN = A0;
	unsigned long SLEEP_TIME = 3000;  // sleep time between reads (seconds * 1000 milliseconds)
	int oldBatteryPcnt = 0;
	MySensor *gw;

	void sendBatteryPower();

protected:

	virtual void processSensor(MySensor *gw);

};

#endif
