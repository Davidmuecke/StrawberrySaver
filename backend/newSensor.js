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

//Ein neuer Sensor wird in der Tabelle "sensors" angelegt
function createNewSensorItem(userID, callback) {

/*---Hier müssen noch die dynamischen Werte vom Sensor angepasst werden,
     aber ich hab keine Ahung, wie man da drauf zugreift??!! @David?---*/

    //als Schlüssel wird die MAC-Adresse des Sensors benutzt
    var sensorID = "1";
    var plantID = "1";

    //Variablen um den den configData JSON zu füllen
    var measuringIntervalSensor = "10";
    var sendIntervalSensor = "10";
    var batteryLevelSensor = "70";

    //Variablen um den den systemData JSON zu füllen
    var brand = "Testmarke";
    var model = "TestModell";
    var version = "Testversion";
    var commissioning = "01.01.1970";
    var serialNumber = "123456";

    var configData = {
        "plant_ID":plantID,
        "measuringInterval":measuringIntervalSensor,
        "sendInterval":sendIntervalSensor,
        "sendOnChange":"true",
        "batteryLevel":batteryLevelSensor
    };

    var systemData = {
        "make":brand,
        "modelDesignation":model,
        "firmwareVersion":version,
        "initialCommissioning":commissioning,
        "serialNumber":serialNumber
    };

    var params = {
        TableName :"sensors",
        Item:{
            "sensor_ID": sensorID,
            "configData":JSON.stringify(configData),
            "systemData":JSON.stringify(systemData)
        }
    };

    return dynamoDb.put(params).promise().then(function (value) {
        return callback(userID, "sensors", editNewSensorForUser)
        return "put ist fertig!";
    });
}

//copy - past aus toolsPlants und minimal angepasst
function getUserAccessData (userID, attribute, callback) {
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
        return result;
        return callback(userID,result);
    });
}



//Nach dem Anlegen des Sensors muss er in der "userAccess" Tabelle
//noch dem entsprechenden Nutzer zugeordnet werden
function editNewSensorForUser(userID,sensorIDs) {
    //hier werden die bereitsexistierenden IDs ausgelesen
    var params = {
        TableName: "userAccess",
        Key:{
            "user_ID" : userID
        }
    };
    var existingItems = dynamoDb.get(params, function(err, data) {
        if (err) {
            //document.getElementById('textarea').innerHTML = "Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2);
        } else {
           // document.getElementById('textarea').innerHTML = "GetItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2);
        }
    }).data.column[2];
    //Wir wollen von dem Item, der zu der entsprechenden userID gehört nur die Werte von "sensors" ausgegeben haben --> 3te Spalte
    //ich bin mir nicht sicher, ob das tatsächlich so funktioniert??!

    //Dabei wird ein JSON zurückgegeben, welcher zu einem Array konvertiert wird, um dann die neue sensorID hinten anzufügen
    // ich bin mir gar nicht sicher, ob hier ein JSON zurück gegeben wird, aber ansonsten ist es noch einfacher!
    var sensorIDsArray = existingItems.split(",");
    sensorIDsArray[sensorIDsArray.length]= sensorID;

    var result = JSON.stringify(sensorIDsArray);

    //Nun soll dieser Wert in der Datanbank aktuallisiert werden
    var params2 = {
        TableName:"userAccess",
        Key:{
            "user_ID" : userID
        },
        UpdateExpression: "set sensors = :newArray",
        ExpressionAttributeValues:{
            ":newArray": result
        },
        ReturnValues:"UPDATED_NEW"
    };

    dynamoDb.update(params2, function(err, data) {
        if (err) {
            //document.getElementById('textarea').innerHTML = "Unable to update item: " + "\n" + JSON.stringify(err, undefined, 2);
        } else {
            //document.getElementById('textarea').innerHTML = "UpdateItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2);
        }
    }).promise().then(function (value) {
        return "Durchgelaufen!";
    });

}

/*---------------------------------------------------------------------------------------------------------------------*/
/*                            Fooder, der je nach Funktionsnamen angepasst werden muss                                 */
/*                            Stellt die Verbindung zur accessDatabase.js Datei her                                    */
/*---------------------------------------------------------------------------------------------------------------------*/

module.exports = {
    createNewSensorItem: createNewSensorItem,
    editNewSensorForUser: editNewSensorForUser
};