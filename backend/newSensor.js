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
function createNewSensorItem(userID, sensorData, callback) {
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
/*                            Footer: zu exportierende Funktionen                                                      */
/*---------------------------------------------------------------------------------------------------------------------*/

module.exports = {
    createNewSensorItem: createNewSensorItem,
    getUserAccessData: getUserAccessData
};