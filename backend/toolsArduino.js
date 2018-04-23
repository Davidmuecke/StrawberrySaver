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
function sensorMeasurement(sensorData, callback) {
    var data = {
        wifiSSID : sensorData.wifi_SSID,
        humiditySensor : sensorData.humiditySensor,
        temperatureSensor : sensorData.temperatureSensor
    };
    var params = {
        //Tabellenname
        TableName: 'cache',
        Item: {
            timestamp: Date.now(),
            sensor_ID: sensorData.sensor_ID,
            measurement: JSON.stringify(data),
            testvalue: sensorData
        }
    };
    //Es wird in die Datenbank geschrieben, das Ergebnis der Operation wird zurück gegeben.
    return dynamoDb.put(params).promise().then(function (value) {
        return callback(sensorData.sensor_ID);
    });
}


function requestSensorData (sensorID) {
    var params = {
        TableName : 'sensors',
        ExpressionAttributeNames:{
            "#id": "sensor_ID",
            "#config": "configData"
        },
        ProjectionExpression:"#config",
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeValues: {
            ":id":sensorID
        }
    };

    return dynamoDb.query(params, function(err, data) {
        if (err) {
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
        }
    }).promise()
        .then(function(value) {
            var item = value.Items[0];
            var configData = JSON.parse(item.configData);

            return "true," + configData.measuringInterval + "," + configData.sendInterval + "," + configData.sendOnChange;
        });
}



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
    sensorMeasurement: sensorMeasurement,
    requestSensorData: requestSensorData
};