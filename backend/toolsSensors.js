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
/*                            Funktionskette, die alle Sensoren eines Users ausgiebt                                   */
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
function getUserAccessData (userID,items, attribute, computeMethod) {
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
    return resultData; //Das Ergebnis muss zurück gegeben werden
}



/*---------------------------------------------------------------------------------------------------------------------*/
/*                          Funktion, die alle Werte für einen bestimmten Sensoren ausgiebt                            */
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
            var allItems = value.Items;
            return allItems;
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
/*                            Fooder, der je nach Funktionsnamen angepasst werden muss                                 */
/*                            Stellt die Verbindung zur accessDatabase.js Datei her                                    */
/*---------------------------------------------------------------------------------------------------------------------*/

module.exports = {
    requestDataForUser: requestDataForUser,
    getUserAccessData: getUserAccessData,
    filterSensorData: filterSensorData,
    requestSensorData: requestSensorData,
    updateSensorConfig:updateSensorConfig
};