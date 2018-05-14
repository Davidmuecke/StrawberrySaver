/*--------------------------------------------------------------------------------------------------------------------*/
/*                                        Allgemeiner Header                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/
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
/*                            Gibt alle Sensoren eines User aus.                                                      */
/*--------------------------------------------------------------------------------------------------------------------*/
function getSensorsForUser (userID) {
    return dynamoDb.scan({ TableName: "sensors" }).promise()
        .then(function(value) {
            var items = value.Items;
            var params = {
                TableName : "userAccess",
                ExpressionAttributeNames:{
                    "#id": "user_ID",
                    "#attribute": "sensors"
                },
                ProjectionExpression:"#attribute",
                KeyConditionExpression: "#id = :id",
                ExpressionAttributeValues: {
                    ":id":userID
                }
            };
            return dynamoDb.query(params).promise().then(function(value) {
                var resultData = [];
                if (typeof value.Items[0] !== 'undefined' && value.Items[0] !== null) {
                    var idsToFilter = value.Items[0].sensors;
                    var sensorIDs = idsToFilter.split(",");

                    items.forEach(function(item, index, array) {
                        if(sensorIDs.includes(item.sensor_ID)) {
                            item.configData = JSON.parse(item.configData);
                            item.systemData = JSON.parse(item.systemData);
                            resultData.push(item);
                        }
                    });
                }
                return resultData;
            });
        });
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*                           Ermittelt alle freien Sensoren eines Benutzers                                           */
/*--------------------------------------------------------------------------------------------------------------------*/
function getFreeSensorsForUser (userID) {
    return dynamoDb.scan({ TableName: "sensors" }).promise()
        .then(function(value) {
            var allItems = value.Items;
            var params = {
                TableName : "userAccess",
                ExpressionAttributeNames:{
                    "#id": "user_ID",
                    "#attribute": "sensors"
                },
                ProjectionExpression:"#attribute",
                KeyConditionExpression: "#id = :id",
                ExpressionAttributeValues: {
                    ":id":userID
                }
            };
            return dynamoDb.query(params).promise().then(function(value) {
                var resultData = [];
                if (typeof value.Items[0] !== 'undefined' && value.Items[0] !== null) {
                    var result = value.Items[0].sensors;
                    var sensorIDs = result.split(",");

                    allItems.forEach(function (item) {
                        if (sensorIDs.includes(item.sensor_ID)) {
                            item.configData = JSON.parse(item.configData);
                            if (!item.configData.hasOwnProperty("plant_ID")) {
                                resultData.push(item.sensor_ID);
                            }
                        }
                    });
                }
                return resultData;
            });
        });
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*                          Gibt alle Werte eines Sensors zurück.                                                     */
/*--------------------------------------------------------------------------------------------------------------------*/
function getSensorData (sensorID) {
    var params = {
        TableName : 'sensors',
        ExpressionAttributeNames:{
            "#id": "sensor_ID"
        },
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeValues: {
            ":id":sensorID
        }
    };
    return dynamoDb.query(params).promise().then(function(value) {
            return value.Items;
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*                                         Aktualisiert die Konfiguration eines Sensors.                              */
/*--------------------------------------------------------------------------------------------------------------------*/
function updateSensorConfig(sensor_ID, configData) {
    var params = {
        TableName: "sensors",
        Key: {
            "sensor_ID": sensor_ID
        },
        UpdateExpression: "set configData = :configData",
        ExpressionAttributeValues: {
            ":configData": JSON.stringify(configData)
        },
        ReturnValues: "UPDATED_NEW"
    };

    return dynamoDb.update(params).promise().then(function (value) {
       return value.Attributes.configData;
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*                                         Neuen Sensor anlegen                                                       */
/*--------------------------------------------------------------------------------------------------------------------*/
/*
Beispiel-body für einen Aufruf dieser Methode über die API:
body: { "sensor_ID": "TEST_JOW",
                  "configData" : {
                    "plant_ID":"1",
                    "measuringInterval":"10",
                    "sendInterval":"10",
                    "sendOnChange":"true",
                    "batteryLevel":"70"
                    },
                  "systemData" : {
                    "make":"Testmarke",
                    "modelDesignation":"Testmodell",
                    "firmwareVersion":"Testversion",
                    "initialCommissioning":"01.02.2003",
                    "serialNumber":"11223344"
                  }
            }
 */
function createSensor(userID, sensorData) {
    var configData = sensorData.configData;
    var systemData = sensorData.systemData;
    var sensor_ID  = sensorData.sensor_ID;

    var params = {
        TableName :"sensors",
        Item:{
            "sensor_ID": sensor_ID,
            "configData":JSON.stringify(configData),
            "systemData":JSON.stringify(systemData)
        }
    };

    return dynamoDb.put(params).promise().then(function (value) {
        var params = {
            TableName : "userAccess",
            ExpressionAttributeNames:{
                "#id": "user_ID",
                "#attribute": "sensors"
            },
            ProjectionExpression:"#attribute",
            KeyConditionExpression: "#id = :id",
            ExpressionAttributeValues: {
                ":id":userID
            }
        };
        var accessString = "value.Items[0]." + "sensors";
        return dynamoDb.query(params).promise().then(function(value) {
            var sensorIDList = eval(accessString);
            sensorIDList = sensorIDList + "," + sensor_ID;

            var params = {
                TableName:"userAccess",
                Key:{
                    "user_ID": userID
                },
                UpdateExpression: "set sensors = :sensors",
                ExpressionAttributeValues:{
                    ":sensors":sensorIDList
                },
                ReturnValues:"UPDATED_NEW"
            };

            return dynamoDb.update(params).promise().then(function (value) {
                return "Der Sensor" + sensor_ID + " wurde angelegt und dem aktuellen User hinzugefügt.";
            });
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*                            Löscht einen Sensor und alle Referenzierungen.                                          */
/*--------------------------------------------------------------------------------------------------------------------*/
function deleteSensor (userID, sensorID) {
        /*
        Schritt 1: Sensor-Daten aus der Datenbank laden.
         */
    var paramsGetSensor = {
        TableName: 'sensors',
        ExpressionAttributeNames: {
            "#id": "sensor_ID"
        },
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeValues: {
            ":id": sensorID
        }
    };
    return dynamoDb.query(paramsGetSensor).promise().then(function (value) {
        /*
        Schritt 2: Sensor aus der Datenbank löschen, wenn er mit keiner Pflanze verknüpft ist.
         */
        var sensorData = value.Items[0];
        var configData = JSON.parse(sensorData.configData);
        if(!configData.hasOwnProperty("plant_ID")) {
            var paramsSensor = {
                TableName: "sensors",
                Key: {
                    "sensor_ID": sensorID
                }
            };
            return dynamoDb.delete(paramsSensor).promise().then(function (value) {
                /*
                    Schritt 3: UserAccess-Daten abfragen.
                    */
                var userAccessParams = {
                    TableName: "userAccess",
                    ExpressionAttributeNames: {
                        "#id": "user_ID",
                        "#attribute": "sensors"
                    },
                    ProjectionExpression: "#attribute",
                    KeyConditionExpression: "#id = :id",
                    ExpressionAttributeValues: {
                        ":id": userID
                    }
                };
                return dynamoDb.query(userAccessParams).promise().then(function (value) {
                    /*
                    Schritt 4: UserAccess-Daten aktualisieren.
                    */
                    var sensorIDList = "";
                    if (typeof value.Items[0].sensors !== 'undefined' && value.Items[0].sensors !== null) {
                        sensorIDList = value.Items[0].sensors;
                    }
                    var sensorIDs = sensorIDList.split(",");
                    var newSensorIDs = "";

                    sensorIDs.forEach(function (item, index) {
                        if (item !== sensorID) {
                            switch (newSensorIDs) {
                                case "":
                                    newSensorIDs += item;
                                    break;
                                default:
                                    newSensorIDs += "," + item;
                                    break;
                            }
                        }
                    });
                    var updatePlantListParams = {
                        TableName: "userAccess",
                        Key: {
                            "user_ID": userID
                        },
                        UpdateExpression: "set sensors = :sensors",
                        ExpressionAttributeValues: {
                            ":sensors": newSensorIDs
                        },
                        ReturnValues: "UPDATED_NEW"
                    };
                    return dynamoDb.update(updatePlantListParams).promise().then(function (value) {
                        return "Löschen erfolgreich: Sensor: " + sensorID;
                    });
                });
            });
        }else {
            return "Der Sensor konnte nicht gelöscht werden, da er mit einer Pflanze verknüpft ist."
        }
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*                            Footer: zu exportierende Funktionen                                                     */
/*--------------------------------------------------------------------------------------------------------------------*/
module.exports = {
    getSensorsForUser: getSensorsForUser,
    getFreeSensorsForUser: getFreeSensorsForUser,
    getSensorData: getSensorData,
    updateSensorConfig:updateSensorConfig,
    createSensor: createSensor,
    deleteSensor: deleteSensor
};