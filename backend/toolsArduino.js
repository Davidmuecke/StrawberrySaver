var ApiBuilder = require('claudia-api-builder'),
    AWS = require('aws-sdk');
//Setzt die Region
AWS.config.update({region: 'us-east-1'});
//Ein Api-Builder wird instaziiert.
var api = new ApiBuilder(),
    //Ein Document-Client (hier DB) wird instanziiert.
    dynamoDb = new AWS.DynamoDB.DocumentClient();
// Erstellt dsa Dynamo-DB service Objekt für das erstellen neuer Tabellen.
dataBase = new AWS.DynamoDB({apiVersion: '2012-08-10'});


//Muss der Sensor als Benutzer registriert sein?
//Speichert die Messung eines Sensors in die Datenbank
api.post('/sensorMeasurement', function (request) {

    //var body = JSON.parse(request.body);
    var data = {
        wifiSSID : request.body.wifi_SSID,
        humiditySensor : request.body.humiditySensor,
        temperatureSensor : request.body.temperatureSensor
    };
    var params = {
        //Tabellenname
        TableName: 'cache',
        Item: {
            timestamp: Date.now(),
            sensor_ID: request.body.sensor_ID,
            measurement: JSON.stringify(data),
            testvalue: request.body
        }
    }
    //Es wird in die Datenbank geschrieben, das Ergebnis der Operation wird zurück gegeben.
    return dynamoDb.put(params).promise(); // returns dynamo result
});

//TEST: post-Request ohne Header um Arduino-Connection zu testen.
api.post('/arduinoTest', function (request) {
    return request;
}, {authorizationType: 'AWS_IAM'});


// TEST: Löscht alle gecachten Daten eines bestimmten Sensors.
api.post('/deleteCachedSensorData', function (request) {
    return toolsPlants.deleteCacheEntries();
}, {authorizationType: 'AWS_IAM'});



/*----------------------------------------------------------------------------------------------------------------------*/
/*                 footer: zu exportierende Funktionen.                                                                 */
/*----------------------------------------------------------------------------------------------------------------------*/
module.exports = {
    sensorMeasurement: sensorMeasurement
};