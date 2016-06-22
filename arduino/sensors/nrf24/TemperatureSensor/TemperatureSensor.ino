
#include <SPI.h>
#include <EEPROM.h>  
#include <MySensor.h>
#include <DHT.h> 
#include <MySigningAtsha204Soft.h>
#include <PinChangeInt.h>


#define USE_SIGNATURE
#define USE_BATTERY_METER

#include "NRF24BasicSensor.h"



#define CHILD_ID_HUM 0
#define CHILD_ID_TEMP 1
#define HUMIDITY_SENSOR_DIGITAL_PIN 4

DHT dht;
float lastTemp;
float lastHum;
boolean metric = true; 




void processSensor() {
	Serial.println("Sending  ...");
	
	MyMessage msgHum(CHILD_ID_HUM, V_HUM);
	MyMessage msgTemp(CHILD_ID_TEMP, V_TEMP);

	delay(dht.getMinimumSamplingPeriod());

	float temperature = dht.getTemperature();
	if (isnan(temperature)) {
		Serial.println("Failed reading temperature from DHT");
	} else if (temperature != lastTemp) {
		lastTemp = temperature;
		if (!metric) {
			temperature = dht.toFahrenheit(temperature);
		}
		gw.send(msgTemp.set(temperature, 1));
		Serial.print("T: ");
		Serial.println(temperature);
	}

	float humidity = dht.getHumidity();
	if (isnan(humidity)) {
		Serial.println("Failed reading humidity from DHT");
	} else if (humidity != lastHum) {
		lastHum = humidity;
		gw.send(msgHum.set(humidity, 1));
		Serial.print("H: ");
		Serial.println(humidity);
	}

}

void setup() {
	Serial.begin(115200);
	Serial.println("##########  setup  ##########");
	initBasic();
	
	dht.setup(HUMIDITY_SENSOR_DIGITAL_PIN); 

	// Send the sketch version information to the gateway and Controller
	gw.sendSketchInfo("Temp/Hum Sensor", "1.0");
	
	gw.present(CHILD_ID_HUM, S_HUM);
	gw.present(CHILD_ID_TEMP, S_TEMP);
	
	metric = gw.getConfig().isMetric;
}

void loop() {
	//processBasic();
	processSensor();
	gw.sleep(SLEEP_TIME);
}
