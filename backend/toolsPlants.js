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
            return nextFunction2(plantsData, cachedData, findLastMeasurement);
        });
}

function mergeCachedData(plantsData, cachedData, nextFunction) {
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

    return nextFunction(plantsData);
}


function deleteCacheEntries() {
    var sensors= [1523381841294, 1];

    var tableName = "cache";
    dataBase.deleteItem({
        "TableName": tableName,
        "Key" : {
            "timestamp": {
                "N" : 1523381841294
            }
        }
    }, function (err, data) {
        if (err) {
            //context.fail('FAIL:  Error deleting item from dynamodb - ' + err);
            return "fail";
        } else {
            console.log("DEBUG:  deleteItem worked. ");
            //context.succeed(data);
            return "done";
        }
    });


    /*
        var params = {
            TableName : 'icecreams',
            Key: {
                icecreamid: 1
            }
        };

        var documentClient = new AWS.DynamoDB.DocumentClient();

        documentClient.delete(params, function(err, data) {
            if (err) console.log(er;
            else console.log(data);
        });
    /*
        var name = "cherry";
        var table = "icecreams"
        var icecreamid = 1;

        var params = {
            TableName:table,
            Key:{
                "icecreamid":icecreamid,
                "name":name
            }
        };

        dynamoDb.delete(params, function(err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
            }
        });







        var itemsArray = [];

            var deletion = {
                DeleteRequest : {
                    Key : {
                        'timestamp' : 1523381841294
                    }
                }
            };
            itemsArray.push(deletion);


        var params = {
            RequestItems: {
                'cache': deletion
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
        });*/

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
/*                 Legt eine neue Pflanze in der Datenbank an.                                                          */
/*----------------------------------------------------------------------------------------------------------------------*/
//Item-Attribute müssen noch angepasst werden.
function insertNewPlant (plant){
    var params = {
        //Tabellenname
        TableName: 'plants',
        //Elemente die gespeichert werden sollen
        Item: {
            //Attribut, wird aus dem Request-Header entnommen.
            plantData: plant.plantData,
            //Attribut, wird aus dem Request-Header entnommen.
            measurements: "",
            plant_ID: "plant_" + Date.now()
        }
    }
    //Es wird in die Datenbank geschrieben, das Ergebnis der Operation wird zurück gegeben.
    return dynamoDb.put(params).promise(); // returns dynamo result
}


/*----------------------------------------------------------------------------------------------------------------------*/
/*                 Aktualisiert die Daten einer Pflanze in der Datenbank.                                               */
/*----------------------------------------------------------------------------------------------------------------------*/
//Item-Attribute müssen noch angepasst werden.
//Hier muss noch die passende Update Syntax verwendet werden --> siehe AWS-Doku
function updatePlant (plant){
    var params = {
        //Tabellenname
        TableName: 'plants',
        //Elemente die gespeichert werden sollen
        Item: {
            //Attribut, wird aus dem Request-Header entnommen.
            plantData: plant.plantData,
            //Attribut, wird aus dem Request-Header entnommen.
            //Können wahrscheinlich einfach weggelassen werden, da sie an deiser Stelle nicht aktualisiert werden müssen.
            measurements: plant.measurements,
            plant_ID: plant.plantID
        }
    }
    //Es wird in die Datenbank geschrieben, das Ergebnis der Operation wird zurück gegeben.
    return dynamoDb.put(params).promise(); // returns dynamo result
}
/*----------------------------------------------------------------------------------------------------------------------*/
/*                 footer: zu exportierende Funktionen.                                                                 */
/*----------------------------------------------------------------------------------------------------------------------*/
module.exports = {
    requestDataForUser: requestDataForUser,
    getUserAccessData: getUserAccessData,
    getPlantData: getPlantData,
    insertNewPlant: insertNewPlant,
    updatePlant: updatePlant,
    getCachedMeasurements: getCachedMeasurements,
    deleteCacheEntries:deleteCacheEntries
};