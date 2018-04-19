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
var toolsPlants = require("./toolsPlants.js");


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
}, {success: 201}, {authorizationType: 'AWS_IAM'});

//aktualisiert die Daten einer Pflanze in der Datenbank.
api.post('/updatePlantData', function (request) {
    return toolsPlants.updatePlant();
}, {authorizationType: 'AWS_IAM'});

/*----------------------------------------------------------------------------------------------------------------------*/
/*  Diese Operationen behandeln die Daten, die von den Sensoren geliefert werden.                                       */
/*----------------------------------------------------------------------------------------------------------------------*/
// TEST: Löscht alle gecachten Daten eines bestimmten Sensors.
api.post('/deleteCachedSensorData', function (request) {
    return toolsPlants.deleteCacheEntries();
}, {authorizationType: 'AWS_IAM'});


//Muss der Sensor als Benutzer registriert sein?
//Speichert die Messung eines Sensors in die Datenbank
api.post('/sensorMeasurement', function (request) {

    //var body = JSON.parse(request.body);
    var data = {
        wifiSSID : request.body.wifiSSID,
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

api.post('/getCachedMeasurements', function(request) {
   return toolsPlants.getCachedMeasurements();
}, {authorizationType: 'AWS_IAM'});


//TEST: post-Request ohne Header um Arduino-Connection zu testen.
api.post('/arduinoTest', function (request) {
    return request;
}, {authorizationType: 'AWS_IAM'});



/*----------------------------------------------------------------------------------------------------------------------*/
/*  footer: die hier zu exportierenden module.                                                                          */
/*----------------------------------------------------------------------------------------------------------------------*/
module.exports = api;
