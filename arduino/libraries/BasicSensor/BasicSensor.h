
#ifndef BasicSensor_h
#define BasicSensor_h

class BasicSensor
{
  public:
  
  private:
  
	const int BATTERY_SENSE_PIN = A0;
	unsigned long SLEEP_TIME = 5000;  // sleep time between reads (seconds * 1000 milliseconds)
	int oldBatteryPcnt = 0;
	MySensor * gw;
	
	int init();
  
};


#endif