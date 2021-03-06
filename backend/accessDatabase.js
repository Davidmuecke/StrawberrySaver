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

/*--------------------------------------------------------------------------------------------------------------------*/
/*  Hier werden die Requirements aufgelistet.                                                                         */
/*--------------------------------------------------------------------------------------------------------------------*/
var toolsPlants = require("./tools/toolsPlants.js");
var toolsSensors = require("./tools/toolsSensors.js");
var toolsArduino = require("./tools/toolsArduino.js");
var toolsUserManagement = require("./tools/toolsUserManagement");

/*--------------------------------------------------------------------------------------------------------------------*/
/*  Operationen für die Benutzerverwaltung.                                                                           */
/*--------------------------------------------------------------------------------------------------------------------*/
api.post('/checkUserData', function (request) {
    return toolsUserManagement.checkUserData(request.context.cognitoIdentityId);
}, {authorizationType: 'AWS_IAM'});

/*--------------------------------------------------------------------------------------------------------------------*/
/*  Diese Operationen behandeln die Pflanzen.                                                                         */
/*--------------------------------------------------------------------------------------------------------------------*/
//liefert alle Pflanzen für einen bestimmten Benutzer zurück.
api.post('/getPlantsForUser', function (request) {
   return toolsPlants.getPlantsForUser(request.context.cognitoIdentityId);
}, {authorizationType: 'AWS_IAM'});

//liefert alle Daten einer bestimmten Pflanze zurück.
api.post('/getPlantData', function (request) {
    return toolsPlants.getPlantData(request.body.plantID);
}, {authorizationType: 'AWS_IAM'});

//speichert eine neue Pflanze in der Datenbank.
api.post('/createPlant', function (request) {
    return toolsPlants.createPlant(request.context.cognitoIdentityId,request.body.plantData);
}, {authorizationType: 'AWS_IAM'});

//aktualisiert die Daten einer Pflanze in der Datenbank.
api.post('/updatePlantData', function (request) {
    return toolsPlants.updatePlant(request.body.plant_ID, request.body.plantData);
}, {authorizationType: 'AWS_IAM'});

//löscht eine Pflanze und alle Referenzierungen aus der Datenbank.
api.post('/deletePlant', function (request) {
    return toolsPlants.deletePlant(request.context.cognitoIdentityId,request.body.plant_ID);
}, {authorizationType: 'AWS_IAM'});

/*--------------------------------------------------------------------------------------------------------------------*/
/*  Diese Operationen behandeln dem Arduino                                                                           */
/*--------------------------------------------------------------------------------------------------------------------*/
//Speichert die Messung eines Sensors in die Datenbank
api.post('/sensorMeasurement', function (request) {
    return toolsArduino.sensorMeasurement(request.body);
});

//TEST: post-Request ohne Header um Arduino-Connection zu testen.
api.post('/arduinoTest', function (request) {
    return toolsArduino.arduinoTest();
});

/*--------------------------------------------------------------------------------------------------------------------*/
/*                          Funktionen für Sensor-Abfragen                                                            */
/*  Diese Operationen behandeln die Daten die für die Sensoren ausgegeben werden sollen                               */
/*--------------------------------------------------------------------------------------------------------------------*/
//liefert alle Sensoren für einen bestimmten Benutzer zurück.
api.post('/getSensorsForUser', function (request) {
    return toolsSensors.getSensorsForUser(request.context.cognitoIdentityId);
}, {authorizationType: 'AWS_IAM'});

api.post('/getFreeSensorsForUser', function (request) {
    return toolsSensors.getFreeSensorsForUser(request.context.cognitoIdentityId)
}, {authorizationType: 'AWS_IAM'});

//liefert alle Sensoren für einen bestimmten Benutzer zurück.
api.post('/getSensorData', function (request) {
    return toolsSensors.getSensorData(request.body.sensor_ID);
}, {authorizationType: 'AWS_IAM'});

//Erstellt einen neuen Sensor für den aktuellen Benutzer.
api.post('/createSensor', function (request) {
    return toolsSensors.createSensor(request.context.cognitoIdentityId,request.body);
}, {authorizationType: 'AWS_IAM'});

//Aktualisiert die Konfiguration eines Sensors.
api.post('/updateSensorConfig', function (request) {
    return toolsSensors.updateSensorConfig(request.body.sensor_ID,request.body.configData);
}, {authorizationType: 'AWS_IAM'});

//löscht einen Sensor und alle Referenzierungen aus der Datenbank.
api.post('/deleteSensor', function (request) {
    return toolsSensors.deleteSensor(request.context.cognitoIdentityId,request.body.sensor_ID);
}, {authorizationType: 'AWS_IAM'});
/*--------------------------------------------------------------------------------------------------------------------*/
/*  footer: die hier zu exportierenden module.                                                                        */
/*--------------------------------------------------------------------------------------------------------------------*/
module.exports = api;