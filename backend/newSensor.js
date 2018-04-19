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
function createNewSensorItem(userID) {

/*---Hier müssen noch die dynamischen Werte vom Sensor angepasst werden,
     aber ich hab keine Ahung, wie man da drauf zugreift??!! @David?---*/

    //als Schlüssel wird die MAC-Adresse des Sensors benutzt
    var sensorID = "01:98:ed:45:01:8";

    //Variablen um den den configData JSON zu füllen
    var measuringIntervalSensor = "10";
    var sendIntervalSensor = "10";
    var batteryLevelSensor = "70";

    //Variablen um den den systemData JSON zu füllen
    var brand = "Testmarke";
    var model = "TestModell";
    var version = "Testversion";
    var commissioning = "01.01.1970";
    var serialNumber = "123456"


    var params = {
        TableName :"sensors",
        Item:{
            "sensor_ID": sensorID,
            "configData":{
                "plant_ID":plantID,
                "measuringInterval":measuringIntervalSensor,
                "sendInterval":sendIntervalSensor,
                "sendOnChange":"true",
                "batteryLevel":batteryLevelSensor
            },
            "systemData":{
                "make":brand,                       //warum heißt das hier make??? sollte das nicht mark heißen??
                "modelDesignation":model,
                "firmwareVersion":version,
                "initialCommissioning":commissioning,
                "serialNumber":serialNumber

            },
        }
    };

    dynamoDb.put(params, function(err, data,) {
        if (err) {
           // document.getElementById('textarea').innerHTML = "Unable to add item: " + "\n" + JSON.stringify(err, undefined, 2);
        } else {
           // document.getElementById('textarea').innerHTML = "PutItem succeeded: " + "\n" + JSON.stringify(data, undefined, 2);
        }
    });

    editNewSensorForUser(userID,sensorID);
}






//Nach dem Anlegen des Sensors muss er in der "userAccess" Tabelle
//noch dem entsprechenden Nutzer zugeordnet werden

function editNewSensorForUser(userID,sensorID) {
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
    }).data.Item[2];


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
    });

}
