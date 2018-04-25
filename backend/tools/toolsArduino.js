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
/*                            Neue Messung in die Cache-Datenbank schreiben.                                          */
/*--------------------------------------------------------------------------------------------------------------------*/
function sensorMeasurement(sensorData) {
    var data = {
        wifiSSID : sensorData.wifi_SSID,
        humiditySensor : sensorData.humiditySensor,
        temperatureSensor : sensorData.temperatureSensor
    };
    var params = {
        TableName: 'cache',
        Item: {
            timestamp: Date.now(),
            sensor_ID: sensorData.sensor_ID,
            measurement: JSON.stringify(data)
        }
    };
    return dynamoDb.put(params).promise().then(function (value) {
        var sensor_ID = sensorData.sensor_ID;
        var params = {
            TableName : 'sensors',
            ExpressionAttributeNames:{
                "#id": "sensor_ID",
                "#config": "configData"
            },
            ProjectionExpression:"#config",
            KeyConditionExpression: "#id = :id",
            ExpressionAttributeValues: {
                ":id":sensor_ID
            }
        };

        return dynamoDb.query(params).promise()
            .then(function(value) {
                var item = value.Items[0];
                var configData = JSON.parse(item.configData);
                return "true," + configData.measuringInterval + "," + configData.sendInterval + "," + configData.sendOnChange;
            });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*                            Testen des Arduinos.                                                                    */
/*--------------------------------------------------------------------------------------------------------------------*/
//TEST: post-Request ohne Header um Arduino-Connection zu testen.
function arduinoTest() {
    return request;
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*                 footer: zu exportierende Funktionen.                                                               */
/*--------------------------------------------------------------------------------------------------------------------*/
module.exports = {
    sensorMeasurement: sensorMeasurement,
    arduinoTest:arduinoTest
};