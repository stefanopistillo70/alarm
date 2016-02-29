#include <MySensor.h>
#include <SPI.h>
 
#define ID 0
#define OPEN 1
#define CLOSE 0
 
MySensor gw;
MyMessage msg(ID, V_TRIPPED);
 
void setup() 
{ 
  Serial.begin(115200);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }
  Serial.println("setup");

  gw.begin();
  gw.present(ID, S_DOOR); 
}
 
void loop()
{
  Serial.println("loop");
     gw.send(msg.set(OPEN)); 
     delay(10000); // Wait 10 seconds
}

