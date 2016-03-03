
#include <MySensor.h>
#include <MySigningAtsha204Soft.h>

#include "BasicSensor.h"

int BasicSensor::init(){
	
		MyTransportNRF24 transport;

		uint8_t soft_serial[SHA204_SERIAL_SZ] = {0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09};
		/*whitelist_entry_t node_whitelist[] = {
		  { .nodeId = 0, // Just some value, this need to be changed to the NodeId of the trusted node
			.serial = {0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09} } // This need to change to the serial of the trusted node
		};
		MySigningAtsha204Soft signer(true,1,node_whitelist,soft_serial,MY_RANDOMSEED_PIN);
		*/
		MySigningAtsha204Soft signer(true,0,NULL,soft_serial,MY_RANDOMSEED_PIN);

		// Hardware profile 
		MyHwATMega328 hw;

		gw = new MySensor(transport, hw , signer);
		
		// use the 1.1 V internal reference
		#if defined(__AVR_ATmega2560__)
		   analogReference(INTERNAL1V1);
		#else
		   analogReference(INTERNAL);
		#endif
		   //gw.begin();
		gw->begin(NULL, 7, false, AUTO);

		// Send the sketch version information to the gateway and Controller
		gw->sendSketchInfo("Battery Meter", "1.0");
	
}
