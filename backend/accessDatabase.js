const ApiBuilder = require('claudia-api-builder'),
    AWS = require('aws-sdk');

//Ein Api-Builder wird instaziiert.
var api = new ApiBuilder(),
    //Ein Document-Client (hier DB) wird instanziiert.
    dynamoDb = new AWS.DynamoDB.DocumentClient();


//Beispiel zum Laden von Daten in die Datenbank
api.post('/postData', function (request) { // SAVE your icecream
    var params = {
        //Tabellenname
        TableName: 'icecreams',
        //Elemente die gespeichert werden sollen
        Item: {
            //Attribut, wird aus dem Request-Header entnommen.
            icecreamid: request.body.icecreamId,
            //Attribut, wird aus dem Request-Header entnommen.
            name: request.body.name // your icecream name
        }
    }
    //Es wird in die Datenbank geschrieben, das Ergebnis der Operation wird zurück gegeben.
    return dynamoDb.put(params).promise(); // returns dynamo result
}, { success: 201 }); // returns HTTP status 201 - Created if successful

//Beispiel für eine Scan-Anfrage.
//Bei einer Scan-Anfrage wird (im Gegensatz zur Query) die komplette Datenbank gelesen.
//Soll das Ergebnis dann doch noch gefiltert werden, kann das durch bearbeitung des Ergebniss-Arrays geschechen.
api.get('/getDataScan', function (request) { // GET all users
    return dynamoDb.scan({ TableName: 'icecreams' }).promise()
        .then(response => response.Items)
});

api.post('/postDataScan', function (request) {
    return dynamoDb.scan({ TableName: request.body.tableName }).promise()
        .then(response => response.Items)
});

//Klassische konfigurierbare (POST-)Query-Anfrage.
//Variablen können über den Anfrage Body mitgegeben werden (als JSON-Objekt).
api.post('/data', function (request) {
    var params = {
        //Name der Tabelle
        TableName : "icecreams",
        //Abkuerzungen fuer die Attribut-Namen
        ExpressionAttributeNames:{
            "#id": "icecreamid",
            "#name": "name"
        },
        //Werte die aus der Tabelle abgefragt werden sollen.
        ProjectionExpression:"#id, #name",
        //Zuordnung der Filter zu den Abkuerzungen
        KeyConditionExpression: "#id = :id",
        //"Filter" fuer die Attribut-Werte.
        ExpressionAttributeValues: {
            ":id":request.body.icecreamId
        }
    };

    return dynamoDb.query(params, function(err, data) {
        if (err) {
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {
                console.log(" -", item.name + ": " + item.icecreamid);
            });
        }
    }).promise()
        .then(response => response.Items)
});

module.exports = api;
