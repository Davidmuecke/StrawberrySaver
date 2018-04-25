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
/*   Gibt alle Pflanzen eines User aus. Dabei werden die verfügbaren Daten der Sensoren in die Pflanzendaten gemerged */
/*   und die Pflanzendaten in der Datenbank aktualisiert. Um den Gesamten Vorgang übersichtlicher zu gestalten, sind  */
/*   hier die einzelnen Operationen in einzelne Funktionen unterteilt.                                                */
/*--------------------------------------------------------------------------------------------------------------------*/
//Liefert alle Pflanzendaten zurück.
function getPlantsForUser (userID) {
    return dynamoDb.scan({ TableName: "plants" }).promise()
        .then(function(value) {
            var items = value.Items;
            return getUserAccessData(userID, items, "plants");
        });
}

//Ermittelt die IDS, auf die der User Zugriff hat.
//Ruft anschließend die Berechnen-Methode auf, um die Daten
//des Users aus der übgergebene Gesamtmenge herauszufiltern.
//userID: ID des Benutzers
//items: Gesamtmenge, aus der eine Teilmenge gefiltert werden soll.
//computeMethod: Funktion, mit der die Teilmenge ermittelt werden soll.
function getUserAccessData (userID,items, attribute) {
    var params = {
        TableName : "userAccess",
        ExpressionAttributeNames:{
            "#id": "user_ID",
            "#attribute": attribute
        },
        ProjectionExpression:"#attribute",
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeValues: {
            ":id":userID
        }
    };
    var accessString = "value.Items[0]." + attribute;
    return dynamoDb.query(params).promise().then(function(value) {
        var result = eval(accessString);
        return filterPlantData(items,result,getCachedMeasurements);
    });
}

//Filtert die für den User passenden Pflanzen heraus.
function filterPlantData(data, idsToFilter, callback) {
    var plantIDs = []
    if (typeof idsToFilter === 'undefined' || idsToFilter === null) {
        plantIDs = idsToFilter.split(",");
    }
    var resultData = [];

    data.forEach(function(item, index, array) {
        if(plantIDs.includes(item.plant_ID)) {
            item.plantData = JSON.parse(item.plantData);
            item.measurements = JSON.parse(item.measurements);
            resultData.push(item);
        }
    });
    return getCachedMeasurements(resultData);
}

//Liest die gecacheten Daten der Datenbank.
function getCachedMeasurements (plantsData) {
    return dynamoDb.scan({ TableName: "cache" }).promise()
        .then(function(value) {
            var cachedData = value.Items;
            return mergeCachedData(plantsData,cachedData);
        });
}

//Merged die gecachten Daten mit denen in der Pflanzen-Datenbank.
function mergeCachedData(plantsData,cachedData) {
    var sensorIDs = [];
    var cacheTimestamps = [];
    plantsData.forEach(function(item, index, array) {
        sensorIDs.push(item.plantData.sensor_ID);
    });

    cachedData.forEach(function (cachedDataItem, cachedDataIndex, cachedDataArray) {
        if(sensorIDs.includes(cachedDataItem.sensor_ID)) {
            cacheTimestamps.push(cachedDataItem.timestamp);
            plantsData.forEach(function(plantsItem, plantsIndex, plantsArray) {
                if(plantsItem.plantData.sensor_ID ===cachedDataItem.sensor_ID) {
                    cachedDataItem.measurement = JSON.parse(cachedDataItem.measurement);
                    cachedDataItem.measurement.timestamp = cachedDataItem.timestamp;
                    (plantsItem.measurements).push(cachedDataItem.measurement);
                }
            });
        }
    });
    return deleteCacheEntries(plantsData, cacheTimestamps);
}

//Löscht die (gemergeten) gecachten Daten.
function deleteCacheEntries(plantsData,keyArray) {
    var keyArraySplit = keyArray;
    var numberOfDeletions = keyArray.length;
    if(numberOfDeletions > 25) {
        keyArraySplit = keyArray.slice(numberOfDeletions-25,numberOfDeletions);
        keyArray.splice(numberOfDeletions-25,25);
    }
    var itemsArray = [];
    if(keyArraySplit.length > 0) {
        keyArraySplit.forEach(function (value) {
            var deletion = {
                DeleteRequest: {
                    Key: {
                        'timestamp': value
                    }
                }
            };
            itemsArray.push(deletion);
        });

        var params = {
            RequestItems: {
                'cache': itemsArray
            }
        };
        return dynamoDb.batchWrite(params).promise().then(function (value) {
            deleteCacheEntries(plantsData, keyArray);
            return savePlantsData(plantsData);
        });
    } else {
        return savePlantsData(plantsData);
    }
}

//Aktualisiert die Daten der Pflanzen des Benutzers in der Datenbank.
function  savePlantsData(plantsData) {
    var measurementsList = [];
    var plantIDs = [];
    plantsData.forEach(function (item, index, array) {
        plantIDs.push(item.plant_ID);
        measurementsList.push(item.measurements);
    });
    return savePlantData(plantsData, plantIDs, measurementsList)
}

function savePlantData(plantsData, plantIDs, measurementsList) {
    if(plantIDs.length > 0) {
        var table = "plants";
        var plant_ID = plantIDs[0];
        var measurements = measurementsList[0];
        plantIDs.splice(0, 1);
        measurementsList.splice(0, 1);

        var params = {
            TableName: table,
            Key: {
                "plant_ID": plant_ID
            },
            UpdateExpression: "set measurements = :measurements",
            ExpressionAttributeValues: {
                ":measurements": JSON.stringify(measurements)
            },
            ReturnValues: "UPDATED_NEW"
        };

        return dynamoDb.update(params).promise().then(function (value) {
            return savePlantData(plantsData, plantIDs, measurementsList);
        });
    } else {
        return findLastMeasurement(plantsData);
    }
}

//Ermittelt die letzte Messung für eine Pflanze und entfernt alle anderen für die Rückgabe.
function findLastMeasurement(plantsData) {
    plantsData.forEach(function (item, index, array) {
        var lastMeasurementTimestamp = -1;
        var lastMeasurement;

        (item.measurements).forEach(function (item, index, array) {
            if(item.timestamp > lastMeasurementTimestamp) {
                lastMeasurement = item;
                lastMeasurementTimestamp = item.timestamp;
            }
        });
        item.measurement = lastMeasurement;
        delete item.measurements;
    });
    return plantsData;
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*                            Gibt alle Daten einer Pflanze zurück.                                                   */
/*--------------------------------------------------------------------------------------------------------------------*/
function getPlantData(plantID) {
    var params = {
        //Name der Tabelle
        TableName : "plants",
        //Abkuerzungen fuer die Attribut-Namen
        ExpressionAttributeNames:{
            "#id": "plant_ID",
            "#measure": "measurements",
            "#data": "plantData"
        },
        //Werte die aus der Tabelle abgefragt werden sollen.
        ProjectionExpression:"#id, #data, #measure",
        //Zuordnung der Filter zu den Abkuerzungen
        KeyConditionExpression: "#id = :id",
        //"Filter" fuer die Attribut-Werte.
        ExpressionAttributeValues: {
            ":id":plantID
        }
    };
    return dynamoDb.query(params).promise().then(function (value) {
            return value.Items;
    })
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*                            Neue Pflanze anlegen und mit Sensor verknüpfen.                                         */
/*--------------------------------------------------------------------------------------------------------------------*/
function createPlant (userID, plantData){
    var sensor_ID = plantData.sensor_ID;
    var plant_ID = "plant_" + Date.now();
    var params = {
        TableName: 'plants',
        Item: {
            plantData: JSON.stringify(plantData),
            measurements: "[]",
            plant_ID: plant_ID
        }
    };
    return dynamoDb.put(params).promise().then(function (value) {

        var paramsQuery = {
            TableName : 'sensors',
            ExpressionAttributeNames:{
                "#id": "sensor_ID"
            },
            KeyConditionExpression: "#id = :id",
            ExpressionAttributeValues: {
                ":id":sensor_ID
            }
        };
        return dynamoDb.query(paramsQuery).promise().then(function(value) {

            var configData = JSON.parse(value.Items[0].configData);
            configData.plant_ID = plant_ID;
            var paramsUpdate = {
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
            return dynamoDb.update(paramsUpdate).promise().then(function (value) {

                var userAccessParams = {
                    TableName : "userAccess",
                    ExpressionAttributeNames:{
                        "#id": "user_ID",
                        "#attribute": "plants"
                    },
                    ProjectionExpression:"#attribute",
                    KeyConditionExpression: "#id = :id",
                    ExpressionAttributeValues: {
                        ":id":userID
                    }
                };
                return dynamoDb.query(userAccessParams).promise().then(function(value) {

                    var plantsIDList = value.Items[0].plants;
                    plantsIDList = plantsIDList + "," + plant_ID;

                    var updatePlantListParams = {
                        TableName:"userAccess",
                        Key:{
                            "user_ID": userID
                        },
                        UpdateExpression: "set plants = :plants",
                        ExpressionAttributeValues:{
                            ":plants":plantsIDList
                        },
                        ReturnValues:"UPDATED_NEW"
                    };
                    return dynamoDb.update(updatePlantListParams).promise().then(function (value) {
                        return "Die Pflanze" + plant_ID + " wurde angelegt und dem aktuellen User sowie dem Sensor " + sensor_ID +" hinzugefügt.";
                    });
                });

            });
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*                            Daten einer Pflanze aktualisieren.                                                      */
/*--------------------------------------------------------------------------------------------------------------------*/
//Item-Attribute müssen noch angepasst werden.
//Hier muss noch die passende Update Syntax verwendet werden --> siehe AWS-Doku
function updatePlant (plantID, plantData){

    var table = "plants";
    plantData = JSON.stringify(plantData);

    var params = {
        TableName:table,
        Key:{
            "plant_ID": plantID
        },
        UpdateExpression: "set plantData = :plantData",
        ExpressionAttributeValues:{
            ":plantData":plantData
        },
        ReturnValues:"UPDATED_NEW"
    };

    return dynamoDb.update(params).promise();
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*                 footer: zu exportierende Funktionen.                                                               */
/*--------------------------------------------------------------------------------------------------------------------*/
module.exports = {
    getPlantsForUser: getPlantsForUser,
    getPlantData: getPlantData,
    createPlant: createPlant,
    updatePlant: updatePlant
};