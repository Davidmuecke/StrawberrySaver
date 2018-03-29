#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <ESP8266HTTPClient.h>

// These constants won't change. They're used to give names to the pins used:
const int analogInPin = A0;  // Analog input pin that the potentiometer is attached to
int sensorValue = 0;        // value read from the pot
ESP8266WiFiMulti WiFiMulti; 

//Config
int measureIntervall = 30;
int latestSendIntervall = 120;
int sendCountdown = latestSendIntervall;
boolean sendOnChange = true;
int     lastWaterSend = -100;
double  lastTempretureSend = -100;

String wifiSSID = "ENTER_SSID";
String pwd = "ENTER_PWD";

void setup() {
  // initialize serial communications at 115200 bps:
  Serial.begin(115200);  
  Serial.println("[Starting UP]...");
  delay(2000);  
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(wifiSSID.c_str() , pwd.c_str());
  Serial.println("[Trying to connect] ...");
  delay(2000); 
}

void loop() {
  // read the analog water sensor
  int waterSensorValue = analogRead(analogInPin); 
  // print the results to the Serial Monitor:
  int tempretureSensorValue = 22.3;
  Serial.print("Feuchtigkeitssensor = ");
  Serial.println(waterSensorValue);  
  if(sendCountdown < 0){
    Serial.println("Countdown Timed OUT!");
    bool wasSend =false;
    int tryMax = 20;
    while(!wasSend && tryMax > 0){
        wasSend = sendRequest(waterSensorValue,22.3);
        delay(20000);
        tryMax--;
      }
      sendCountdown = latestSendIntervall;
    }
  if(sendOnChange){    
    Serial.println("On Change!");    
    int waterDiff= abs(lastWaterSend - waterSensorValue);
    double tempDiff = abs(lastTempretureSend - tempretureSensorValue);
    Serial.print("Diff Wasser: ");
    Serial.println(waterDiff); 
    Serial.print("Diff Temp: ");
    Serial.println(tempDiff); 
    if(waterDiff > 19 || tempDiff > 1){
          if(sendRequest(waterSensorValue,22.3)){
              lastWaterSend = waterSensorValue;
              lastTempretureSend = 22.3;
              sendCountdown = latestSendIntervall;
            }
      }
    }
  
  delay(measureIntervall *1000);
  sendCountdown -= measureIntervall;
}

boolean sendRequest(int water, double tempreture){
  if((WiFiMulti.run() == WL_CONNECTED)) { //Is the NodeMCUv2 connected?
        HTTPClient http;

        Serial.print("[HTTP] begin...\n");
        // configure traged server and url
        //URL + Fingerprint
        //http.begin("https://5zdey468pk.execute-api.us-east-1.amazonaws.com/latest/arduinoTest","30 13 cd 0e d9 0c 2f 94 2f 13 e8 5b 9d c4 1d 56 30 e2 00 e0");
        http.begin("https://fu8pk1jle1.execute-api.us-east-1.amazonaws.com/dev/database-access-service-dev-hello","30 13 cd 0e d9 0c 2f 94 2f 13 e8 5b 9d c4 1d 56 30 e2 00 e0");
        //Line 739: void HTTPClient::addHeader(const String& name, const String& value, bool first, bool replace)        
        http.addHeader("content-type","application/json",false,false);
        http.setUserAgent("StrawberrySaver");
        // start connection and send HTTP header
        String payload ="{\"SensorID\":\"12345\",\"WifiSSID\":\""+wifiSSID +"\",\"water\":"+water+",\"tempreture\":"+tempreture+
                        "\"measureIntervall\":"+measureIntervall+"\"sendIntervall\":"+latestSendIntervall+"\"sendOnChange\":"+ sendOnChange+"}";
        //POST 
        int httpCode = http.POST("PAYLOAD");

        // httpCode will be negative on error
        if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            Serial.printf("[HTTP] POST... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();
                Serial.println("Answer: ");
                Serial.println(payload);
            }
        } else {
            Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }
        //Close Connection
        http.end();
        return true;
    } else {
      Serial.println(WiFiMulti.run());
      return false;
    }
  }
