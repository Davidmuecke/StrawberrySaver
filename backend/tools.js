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

module.exports = {
    getUserAccessData: function (userID,attribute, callback) {
       var params = {
           //Name der Tabelle
           TableName : "userAccess",
           //Abkuerzungen fuer die Attribut-Namen
           ExpressionAttributeNames:{
               "#id": "user_ID",
               "#attribute": attribute
           },
           //Werte die aus der Tabelle abgefragt werden sollen.
           ProjectionExpression:"#attribute",
           //Zuordnung der Filter zu den Abkuerzungen
           KeyConditionExpression: "#id = :id",
           //"Filter" fuer die Attribut-Werte.
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
            var test = JSON.parse(eval(accessString));
            callback(test);
            return test;
        });

    },
    getSensorData: function(sensorID,attributes, callback) {
        var params = {
            //Name der Tabelle
            TableName : "sensors",
            //Abkuerzungen fuer die Attribut-Namen
            ExpressionAttributeNames:{
                "#id": "sensor_ID",
                "#attribute": attributes
            },
            //Werte die aus der Tabelle abgefragt werden sollen.
            ProjectionExpression:"#attribute",
            //Zuordnung der Filter zu den Abkuerzungen
            KeyConditionExpression: "#id = :id",
            //"Filter" fuer die Attribut-Werte.
            ExpressionAttributeValues: {
                ":id":sensorID
            }
        };
        var accessString = "value.Items[0]." + attributes;
        return dynamoDb.query(params, function(err, data) {
            if (err) {
                console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
            }
        }).promise().then(function(value) {
            var test = JSON.parse(eval(accessString));
            callback(test);
            return test;
        });
    },



    getCachedData: function(sensorID, callback) {
        var params = {
            //Name der Tabelle
            TableName : "sensors",
            //Abkuerzungen fuer die Attribut-Namen
            ExpressionAttributeNames:{
                "#id": "sensor_ID",
                "#attribut": attributes
            },
            //Werte die aus der Tabelle abgefragt werden sollen.
            ProjectionExpression:"#attribut",
            //Zuordnung der Filter zu den Abkuerzungen
            KeyConditionExpression: "#id = :id",
            //"Filter" fuer die Attribut-Werte.
            ExpressionAttributeValues: {
                ":id":sensorID
            }
        };
        var accessString = "value.Items[0]." + attributes;
        return dynamoDb.query(params, function(err, data) {
            if (err) {
                console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
            }
        }).promise().then(function(value) {
            var test = JSON.parse(eval(accessString));
            callback(test);
            return test;
        });
    }




};