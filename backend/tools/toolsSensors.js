/*---------------------------------------------------------------------------------------------------------------------*/
/*                                        Allgemeiner Header                                                           */
/*---------------------------------------------------------------------------------------------------------------------*/
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



/*---------------------------------------------------------------------------------------------------------------------*/
/*                            Gibt alle Sensoren eines User aus.                                                       */
/*---------------------------------------------------------------------------------------------------------------------*/
//Gibt bestimmte Daten für einen bestimmten Benutzer zurück.
//usderID: ID des Benutzers
//attribute: Datenbanktabelle, die ausgelesen werden soll: sensors
//userAccessDataMethod: Methode mit der die Access-Daten ermittelt werden
//computeMethod: Methode mit der die ermittelten Daten ausgewertet und bearbeitet werden.
function requestDataForUser (userID, attribute, userAccessDataMethod) {
    return dynamoDb.scan({ TableName: attribute }).promise()
        .then(function(value) {
            var allItems = value.Items;
            return userAccessDataMethod(userID, allItems, attribute, filterSensorData);
        });
}

//Ermittelt die IDS, auf die der User Zugriff hat.
//Ruft anschließend die Berechnen-Methode auf, um die Daten
//des Users aus der übgergebene Gesamtmenge herauszufiltern.
//userID: ID des Benutzers
//items: Gesamtmenge, aus der eine Teilmenge gefiltert werden soll.
//computeMethod: Funktion, mit der die Teilmenge ermittelt werden soll.
function getSensorsForUser (userID,items, attribute, computeMethod) {
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
    return dynamoDb.query(params, function(err, data) {
        if (err) {
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
        }
    }).promise().then(function(value) {
        var result = eval(accessString);
        return computeMethod(items,result);
    });
}


//Filtert die für den User passenden Sensoren heraus.
function filterSensorData(data, idsToFilter) {
    var sensorIDs = idsToFilter.split(",");
    var resultData = [];

    data.forEach(function(item, index, array) {
        if(sensorIDs.includes(item.sensor_ID)) {
            item.configData = JSON.parse(item.configData);
            item.systemData = JSON.parse(item.systemData);
            resultData.push(item);
        }
    });
    return resultData;
}

/*---------------------------------------------------------------------------------------------------------------------*/
/*                          Gibt alle Werte eines Sensors zurück.                                                      */
/*---------------------------------------------------------------------------------------------------------------------*/
function requestSensorData (sensorID) {

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

    return dynamoDb.query(params, function(err, data) {
        if (err) {
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
        }
    }).promise()
        .then(function(value) {
            return value.Items;
        });
}

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

/*---------------------------------------------------------------------------------------------------------------------*/
/*                                         Neuen Sensor anlegen                                                        */
/*---------------------------------------------------------------------------------------------------------------------*/
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

//Ein neuer Sensor wird in der Tabelle "sensors" angelegt
function createSensor(userID, sensorData, callback) {
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
        return callback(userID, sensor_ID, "sensors", addNewSensorToUser);
    });
}

//copy - past aus toolsPlants. Nur paramlist von fundef und callback-Aufruf angepasst.
function getUserAccessData (userID, sensorID,attribute, callback) {
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
    return dynamoDb.query(params, function(err, data) {
        if (err) {
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
        }
    }).promise().then(function(value) {
        var result = eval(accessString);
        //return result;
        return callback(userID,sensorID, result);
    });
}

//Der aktuelle Benutzer bekommt Zugriffsrecht auf den neu angelegten Sensor.
function addNewSensorToUser(userID,sensorID, sensorIDList) {
    sensorIDList = sensorIDList + "," + sensorID;

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

    return dynamoDb.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
    }).promise().then(function (value) {
        return "Der Sensor" + sensorID + " wurde angelegt und dem aktuellen User hinzugefügt.";
    });
}

/*---------------------------------------------------------------------------------------------------------------------*/
/*                                         Verknüpft Sensor mit Pflanze.                                               */
/*---------------------------------------------------------------------------------------------------------------------*/


/*---------------------------------------------------------------------------------------------------------------------*/
/*                            Footer: zu exportierende Funktionen                                                      */
/*---------------------------------------------------------------------------------------------------------------------*/
module.exports = {
    createSensor: createSensor,
    getUserAccessData: getUserAccessData,
    requestDataForUser: requestDataForUser,
    getSensorsForUser: getSensorsForUser,
    filterSensorData: filterSensorData,
    requestSensorData: requestSensorData,
    updateSensorConfig:updateSensorConfig
};