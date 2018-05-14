/*
 * v2 including temperature measurement 
 */

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <DallasTemperature.h> //from https://github.com/milesburton/Arduino-Temperature-Control-Library
#include <Base64.h>
#include <OneWire.h> //from https://github.com/PaulStoffregen/OneWire

// These constants won't change. They're used to give names to the pins used:
const int analogInPin = A0;  // Analog input pin that the potentiometer (humidity) is attached to
#define ONE_WIRE_BUS D1 // DS18B20 sensor data port (temperature)
#define LED D0 //onboard Led

float getTemperature();

ESP8266WiFiMulti WiFiMulti; 
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);

//Config
int     measureIntervall = 20;
int     latestSendIntervall = 120;
int     sendCountdown = latestSendIntervall;
boolean sendOnChange = true;
int     lastWaterSend = -100;
double  lastTemperatureSend = -100;
char    temperaturStr[6];

//wifi config
String  wifiSSID = "SSID";
String  pwd = "Password";

void setup() {
  pinMode(LED, OUTPUT);
  // initialize serial communications at 115200 bps:
  Serial.begin(115200);  
  Serial.println("[Starting UP]...");
  delay(2000);  
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(wifiSSID.c_str() , pwd.c_str());
  Serial.println("[Trying to connect] ...");
  DS18B20.begin();
  delay(2000); 
}

void loop() {
  // read the analog water sensor
  int waterSensorValue = analogRead(analogInPin); 
  //read digital temperature sensor
  double temperatureSensorValue = getTemperature();
  // print the results to the Serial Monitor:
  Serial.print("Humdity Sensor = ");
  Serial.println(waterSensorValue); 
  Serial.print("Temperature Sensor = ");
  Serial.println(temperatureSensorValue); 
  
  //check send countdown
  if(sendCountdown < 0){
    Serial.println("Countdown Timed OUT!");
    bool wasSend =false;
    int tryMax = 20;
    while(!wasSend && tryMax > 0){
        wasSend = sendRequest(waterSensorValue,temperatureSensorValue);
        delay(60000);
        tryMax--;
      }
      sendCountdown = latestSendIntervall;
    }
    
  if(sendOnChange){    
    Serial.println("On Change!");    
    int waterDiff= abs(lastWaterSend - waterSensorValue);
    double tempDiff = abs(lastTemperatureSend - temperatureSensorValue);
    Serial.print("Diff Wasser: ");
    Serial.println(waterDiff); 
    Serial.print("Diff Temp: ");
    Serial.println(tempDiff); 
    if(waterDiff > 19 || tempDiff > 1){
          if(sendRequest(waterSensorValue,temperatureSensorValue)){
              lastWaterSend       = waterSensorValue;
              lastTemperatureSend = temperatureSensorValue;
              sendCountdown       = latestSendIntervall;
            }
      }
    }
  
  delay(measureIntervall *1000);
  sendCountdown -= measureIntervall;
}

float getTemperature() {
 float temp;
 do {
 DS18B20.requestTemperatures(); 
 temp = DS18B20.getTempCByIndex(0);
 delay(100);
 } while (temp == 85.0 || temp == (-127.0));
 return temp;
}

boolean sendRequest(int water, double tempreture){
  if((WiFiMulti.run() == WL_CONNECTED)) { //Is the NodeMCUv2 connected?
        HTTPClient http;

        Serial.print("[HTTP] begin...\n");
        // configure traged server and url
        //URL + Fingerprint
        http.begin("https://5zdey468pk.execute-api.us-east-1.amazonaws.com/latest/sensorMeasurement","30 13 cd 0e d9 0c 2f 94 2f 13 e8 5b 9d c4 1d 56 30 e2 00 e0");
        //http.begin("https://fu8pk1jle1.execute-api.us-east-1.amazonaws.com/dev/database-access-service-dev-hello","30 13 cd 0e d9 0c 2f 94 2f 13 e8 5b 9d c4 1d 56 30 e2 00 e0");
        //Line 739: void HTTPClient::addHeader(const String& name, const String& value, bool first, bool replace)        
        http.addHeader("content-type","application/json; charset=UTF-8",false,false);
        http.setUserAgent("StrawberrySaver");
        // start connection and send HTTP header
        String wifiTest = "007007";
        String payload ="{\"sensor_ID\": \"dk001\", \"wifi_SSID\": \""+wifiTest +"\", \"humiditySensor\": "+water+",\"temperatureSensor\": "+tempreture+
                        ", \"measureIntervall\": "+measureIntervall+", \"sendIntervall\": "+latestSendIntervall+", \"sendOnChange\": "+ sendOnChange+"}";
        
        //POST 
        int httpCode = http.POST(payload);
        Serial.println(payload);
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