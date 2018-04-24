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

/*----------------------------------------------------------------------------------------------------------------------*/
/*  Hier werden die Requirements aufgelistet.                                                                           */
/*----------------------------------------------------------------------------------------------------------------------*/
var toolsPlants = require("./tools/toolsPlants.js");
var toolsSensors = require("./tools/toolsSensors.js");
var toolsArduino = require("./tools/toolsArduino.js");


/*----------------------------------------------------------------------------------------------------------------------*/
/*  Diese Operationen behandeln die Pflanzen.                                                                           */
/*----------------------------------------------------------------------------------------------------------------------*/
//liefert alle Pflanzen für einen bestimmten Benutzer zurück.
api.post('/getPlantsForUser', function (request) {
   return toolsPlants.requestDataForUser(request.context.cognitoIdentityId,"plants",toolsPlants.getUserAccessData);
}, {authorizationType: 'AWS_IAM'});

//liefert alle Daten einer bestimmten Pflanze zurück.
api.post('/getPlantData', function (request) {
    return toolsPlants.getPlantData(request.body.plantID);
}, {authorizationType: 'AWS_IAM'});

//speichert eine neue Pflanze in der Datenbank.
api.post('/insertNewPlant', function (request) {
    return toolsPlants.insertNewPlant(request.body.plant);
}, {authorizationType: 'AWS_IAM'});

//aktualisiert die Daten einer Pflanze in der Datenbank.
api.post('/updatePlantData', function (request) {
    return toolsPlants.updatePlant(request.body.plant_ID, request.body.plantData);
}, {authorizationType: 'AWS_IAM'});

/*----------------------------------------------------------------------------------------------------------------------*/
/*  Diese Operationen behandeln dem Arduino                                                                           */
/*----------------------------------------------------------------------------------------------------------------------*/
//Speichert die Messung eines Sensors in die Datenbank
api.post('/sensorMeasurement', function (request) {
    return toolsArduino.sensorMeasurement(request.body, toolsArduino.requestSensorData);
});

//TEST: post-Request ohne Header um Arduino-Connection zu testen.
api.post('/arduinoTest', function (request) {
    return toolsArduino.arduinoTest();
});

/*---------------------------------------------------------------------------------------------------------------------*/
/*                          Funktionen für Sensor-Abfragen                                                          */
/*  Diese Operationen behandeln die Daten die für die Sensoren ausgegeben werden sollen                                */
/*---------------------------------------------------------------------------------------------------------------------*/
//liefert alle Sensoren für einen bestimmten Benutzer zurück.
api.post('/getSensorsForUser', function (request) {
    return toolsSensors.requestSensorsForUser(request.context.cognitoIdentityId);
}, {authorizationType: 'AWS_IAM'});

api.post('/getFreeSensorsForUser', function (request) {
    return toolsSensors.requestFreeSensorsForUser(request.context.cognitoIdentityId)
}, {authorizationType: 'AWS_IAM'});

//liefert alle Sensoren für einen bestimmten Benutzer zurück.
api.post('/getSensorData', function (request) {
    return toolsSensors.requestSensorData(request.body.sensor_ID);
}, {authorizationType: 'AWS_IAM'});

//Erstellt einen neuen Sensor für den aktuellen Benutzer.
api.post('/createSensor', function (request) {
    return toolsSensors.createSensor(request.context.cognitoIdentityId,request.body);
}, {authorizationType: 'AWS_IAM'});

//Aktualisiert die Konfiguration eines Sensors.
api.post('/updateSensorConfig', function (request) {
    return toolsSensors.updateSensorConfig(request.body.sensor_ID,request.body.configData);
}, {authorizationType: 'AWS_IAM'});

/*----------------------------------------------------------------------------------------------------------------------*/
/*  footer: die hier zu exportierenden module.                                                                          */
/*----------------------------------------------------------------------------------------------------------------------*/
module.exports = api;