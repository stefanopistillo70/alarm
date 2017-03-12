
#include <RCSwitch.h>
#include <Wire.h>


/* RCSwitch */

#define TIMER_INTERVAL_SKIPSAMEVALUE_MS	500

RCSwitch mySwitch = RCSwitch();

unsigned long rcsw_lastDecimalValue;
unsigned long rcsw_nextValidTime;


String inputString = "";         // a string to hold incoming data
boolean stringComplete = false;  // whether the string is complete



void setup() {
	Wire.begin(8);
	Serial.begin(9600);
	Serial.println("I2CGateway433 ready (v 1.0)");


	/* RCSwitch */

	mySwitch.enableReceive(0);  // Receiver on interrupt 0 => that is pin #2

	// Transmitter is connected to Arduino Pin #10  
	mySwitch.enableTransmit(10);

	// Optional set pulse length.
	// mySwitch.setPulseLength(320);

	// Optional set protocol (default is 1, will work for most outlets)
	// mySwitch.setProtocol(2);

	// Optional set number of transmission repetitions.
	// mySwitch.setRepeatTransmit(15);

	rcsw_lastDecimalValue = 0;
	rcsw_nextValidTime = millis() + TIMER_INTERVAL_SKIPSAMEVALUE_MS;

	inputString.reserve(200);

}

void loop() {

	/* RCSwitch */

	if (mySwitch.available()) {

		int value = mySwitch.getReceivedValue();

		if (value == 0) {
			Serial.print("Unknown encoding");
		} else {

			unsigned long decimal = mySwitch.getReceivedValue();

			//Serial.print("elapsed: "); Serial.print(((long) ((millis() - rcsw_nextValidTime)) + TIMER_INTERVAL_SKIPSAMEVALUE_MS));
			if ((rcsw_lastDecimalValue != decimal) || ((long) (millis() - rcsw_nextValidTime) >= 0)) {

				unsigned int protocol = mySwitch.getReceivedProtocol();
				unsigned int length = mySwitch.getReceivedBitlength();

				/* * /
				char* binary = dec2binWzerofill(decimal, length);
				//unsigned int delay = mySwitch.getReceivedDelay();
				//unsigned int* raw = mySwitch.getReceivedRawdata();
				Serial.print("Received: "); Serial.print(binary);
				//Serial.print("; length: "); Serial.print(length); Serial.print(" bit");
				//Serial.print("; Protocol: "); Serial.print(protocol);
				//Serial.print("; delay: "); Serial.print(delay);
				Serial.print("; decimal: "); Serial.print(decimal);
				//Serial.println("");
				if ((protocol == 1) && (length == 24)) {
					unsigned int addresscode = (decimal >> 8) & 0xFFFF;
					byte commandcode = (decimal & 0xFF);
					Serial.print("; addresscode: "); Serial.print(addresscode); Serial.print("; commandcode: "); Serial.print(commandcode); Serial.println("");
				}
				/* */

				if ((protocol == 1) && (length == 24)) {
					char result[50];
					sprintf(result,"[%d]\n",decimal);
					Serial.print(result);
					sendToI2c(result);
					
				}

			}

			rcsw_lastDecimalValue = decimal;
			rcsw_nextValidTime = millis() + TIMER_INTERVAL_SKIPSAMEVALUE_MS;
		}

		mySwitch.resetAvailable();
	}

	// use to send
	//unsigned long value = 0;
	//mySwitch.send(value, 24);

	// print the string when a newline arrives:
	if (stringComplete) {
		//Serial.print(inputString);
		unsigned long value = (unsigned long) inputString.toFloat();
		/*
		if (value > 100) {
			Serial.print("sending value: "); Serial.println(value);
			mySwitch.send(value, 24);
		}
		*/
		// clear the string:
		inputString = "";
		stringComplete = false;
	}

}





/*
  SerialEvent occurs whenever a new data comes in the
 hardware serial RX.  This routine is run between each
 time loop() runs, so using delay inside loop can delay
 response.  Multiple bytes of data may be available.
 */
void serialEvent() {
	while (Serial.available()) {
		// get the new byte:
		char inChar = (char) Serial.read();
		// add it to the inputString:
		inputString += inChar;
		// if the incoming character is a newline, set a flag
		// so the main loop can do something about it:
		if (inChar == '\n') {
			stringComplete = true;
		}
	}
}


static char* dec2binWzerofill(unsigned long Dec, unsigned int bitLength){
	static char bin[64]; 
	unsigned int i = 0;
	while (Dec > 0) {
		bin[32 + i++] = (Dec & 1 > 0) ? '1' : '0';
		Dec = Dec >> 1;
	}
	for (unsigned int j = 0; j< bitLength; j++) {
		if (j >= bitLength - i) {
			bin[j] = bin[ 31 + i - (j - (bitLength - i)) ];
		} else {
			bin[j] = '0';
		}
	}
	bin[bitLength] = '\0';
	return bin;
}


void sendToI2c(char* data){
	Wire.beginTransmission(8); // transmit to device #8
	Wire.write(data);       
	Wire.endTransmission(); 
}
