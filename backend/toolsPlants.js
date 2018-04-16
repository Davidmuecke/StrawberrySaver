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
/*                 Liefert alle Pflanzen für den aktuellen User zurück.                                                 */
/*----------------------------------------------------------------------------------------------------------------------*/
//Gibt bestimmte Daten für einen bestimmten Benutzer zurück.
//usderID: ID des Benutzers
//attribute: Datenbanktabelle, die ausgelesen werden soll: plants, sensors, oder locations
//userAccessDataMethod: Methode mit der die Access-Daten ermittelt werden
//computeMethod: Methode mit der die ermittelten Daten ausgewertet und bearbeitet werden.
function requestDataForUser (userID, attribute, userAccessDataMethod) {
    return dynamoDb.scan({ TableName: attribute }).promise()
        .then(function(value) {
            var allItems = value.Items;
            return userAccessDataMethod(userID, allItems, attribute, filterPlantData);
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
        return computeMethod(items,result,getCachedMeasurements);
    });
}

//Filtert die für den User passenden Pflanzen heraus.
function filterPlantData(data, idsToFilter, callback) {
    var plantIDs = idsToFilter.split(",");
    var resultData = [];

    data.forEach(function(item, index, array) {
        if(plantIDs.includes(item.plant_ID)) {
            item.plantData = JSON.parse(item.plantData);
            item.measurements = JSON.parse(item.measurements);
            resultData.push(item);
        }
    });
    return callback(resultData, mergeCachedData);
}

//Liest die gecacheten Daten der Datenbank.
function getCachedMeasurements (plantsData, nextFunction2) {
    return dynamoDb.scan({ TableName: "cache" }).promise()
        .then(function(value) {
            var cachedData = value.Items;
            return nextFunction2(plantsData, cachedData);
        });
}

function mergeCachedData(plantsData, cachedData) {
    //sensor_IDs der "Verfügbaren" Pflanzen ermitteln
    var sensorIDs = [];
    plantsData.forEach(function(item, index, array) {
        sensorIDs.push(item.plantData.sensor_ID);
    });

    cachedData.forEach(function (cachedDataItem, cachedDataIndex, cachedDataArray) {
        if(sensorIDs.includes(cachedDataItem.sensor_ID)) {
            plantsData.forEach(function(plantsItem, plantsIndex, plantsArray) {
                if(plantsItem.plantData.sensor_ID ===cachedDataItem.sensor_ID) {
                    cachedDataItem.measurement = JSON.parse(cachedDataItem.measurement);
                    cachedDataItem.measurement.timestamp = cachedDataItem.timestamp;
                    (plantsItem.measurements).push(cachedDataItem.measurement);
                    //Hier müssen nun noch die "benutzten Daten aus dem Cache gelöscht werden.
                }
            });
        }
    });

    return plantsData;
}


function deleteCacheEntries(sensorIDs) {
    var sensors= ["00:80:41:ae:fd:7", "xxx"];
    var itemsArray = [];

    sensors.forEach(function(item, index, array) {
        var deletion = {
            DeleteRequest : {
                Key : {
                    'sensor_ID' : item
                }
            }
        };
        itemsArray.push(deletion);
    });


    var params = {
        RequestItems : {
            'cache' : itemsArray
        }
    };
    dynamoDb.batchWrite(params, function(err, data) {
        if (err) {
            console.log('Batch delete unsuccessful ...');
            console.log(err, err.stack); // an error occurred
        } else {
            console.log('Batch delete successful ...');
            console.log(data); // successful response
        }
    });
    return itemsArray;
}

function  savePlantsData() {
    //dynamoDB upgrade Function
    // um den Eintrag einer Pflanze zu aktualisieren.

}
//Ermittelt die letzte Messung für eine Plfanze und entfernt alle anderen.
function findLastMeasurement(plantsData) {
    plantsData.forEach(function (item, index, array) {
        var lastMeasurementTimestamp = 0;
        var lastMeasurement;

        plantsData.measurements.forEach(function (item, index, array) {
            if(item.timestamp > lastMeasurementTimestamp) {
                lastMeasurement = item;
            }
        });

        item.measurement = lastMeasurement;
        item.measurements= NULL;
    });

    return plantsData;
}

/*----------------------------------------------------------------------------------------------------------------------*/
/*                 Liefert alle Daten einer bestimmten Pflanze zurück.                                                  */
/*----------------------------------------------------------------------------------------------------------------------*/
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
    return dynamoDb.query(params, function(err, data) {
        if (err) {
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
        }
    }).promise()
        .then(response => response.Items)
};

/*----------------------------------------------------------------------------------------------------------------------*/
/*                 footer: zu exportierende Funktionen.                                                                 */
/*----------------------------------------------------------------------------------------------------------------------*/
module.exports = {
    requestDataForUser: requestDataForUser,
    getUserAccessData: getUserAccessData,
    filterPlantData: filterPlantData,
    getCachedMeasurements:getCachedMeasurements,
    mergeCachedData: mergeCachedData,
    deleteCacheEntries:deleteCacheEntries
};