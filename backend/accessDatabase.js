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

var tools = require("./tools.js");

//liefert alle Pflanzen für einen bestimmten Benutzer zurück.
api.post('/getPlantsForUser', function (request) {
   return tools.requestDataForUser(request.body.userID,"plants",tools.getUserAccessData);
}, {authorizationType: 'AWS_IAM'});


api.post('/deleteCachedSensorData', function (request) {
    return tools.deleteCacheEntries(request.body.sensorID);
}, {authorizationType: 'AWS_IAM'});



//Speichert die Messung eines Sensors in die Datenbank
api.post('/sensorMeasurement', function (request) { // SAVE your icecream
    var data = {
        wifi_SSID : request.body.wifi_SSID,
        humiditySensor : request.body.humiditySensor,
        temperatureSensor : request.body.temperatureSensor
    };
    var params = {
        //Tabellenname
        TableName: 'cache',
        Item: {
            timestamp: Date.now(),
            sensor_ID: request.body.sensorID,
            measurement: JSON.stringify(data)
           }
    }
    //Es wird in die Datenbank geschrieben, das Ergebnis der Operation wird zurück gegeben.
    return dynamoDb.put(params).promise(); // returns dynamo result
}, { success: 201 }); // returns HTTP status 201 - Created if successful

api.post('/getCachedMeasurements', function(request) {
   return tools.getCachedMeasurements();
}, {authorizationType: 'AWS_IAM'});


//Post-Request ohne Header um Arduino-Connection zu testen.
api.post('/arduinoTest', function (request) {
    return request;
}, {authorizationType: 'AWS_IAM'});


module.exports = api;
