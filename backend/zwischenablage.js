/*//Benoetigte Parameter im Body:
//  - sensorID
api.post('/getSensorData', function (request) {

    //return JSON.parse("{\"make\":\"Testmarke\",\"modelDesignation\":\"TestModell\",\"firmwareVersion\":\"Testversion\",\"initialCommissioning\":\"01.01.1970\",\"serialNumber\":\"123456\"}");
    var sensorID = request.body.sensorID;
    var attributes = request.body.attributes;
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
    var accessString = "response.Items[0]." + attributes;
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
        .then(response => JSON.parse(eval(accessString)))
}, {authorizationType: 'AWS_IAM'});

function sensorData(sensorID, attributes) {
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
    var accessString = "response.Items[0]." + attributes;
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
        .then(response => JSON.parse(eval(accessString)))
}, {authorizationType: 'AWS_IAM'});

//Post-Request ohne Header um Arduino-Connection zu testen.
api.post('/requestTEST', function (request) {
    var testValue = tools.getSensorData(request.body.sensorID, request.body.attributes, test_function);
    return testValue;
}, {authorizationType: 'AWS_IAM'});


//Post-Request ohne Header um Arduino-Connection zu testen.
api.post('/requestUserAccessData', function (request) {
    var testValue = tools.getUserAccessData(request.body.userID, request.body.attribute);
    return testValue;
}, {authorizationType: 'AWS_IAM'});

//Post-Request ohne Header um Arduino-Connection zu testen.
api.post('/requestPlantDataByUserID', function (request) {
    var result = tools.getPlantsByUserID(request.body.plantID,"1,2,3");
    return result;
}, {authorizationType: 'AWS_IAM'});

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
//Soll das Ergebnis dann doch noch gefiltert werden, kann das durch Bearbeitung des Ergebniss-Arrays geschehen.
api.get('/getDataScan', function (request) { // GET all users
    return dynamoDb.scan({ TableName: 'icecreams' }).promise()
        .then(response => response.Items)
}, {authorizationType: 'AWS_IAM'});

api.post('/postDataScan', function (request) {
    return dynamoDb.scan({ TableName: request.body.tableName }).promise()
        .then(response => response.Items)
}, {authorizationType: 'AWS_IAM'});

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
}, {authorizationType: 'AWS_IAM'});

//Get-Request mit Zugriff auf die Variablen in der URL
api.get('/helloWorld', function (request) {
   return 'Hello ' + request.queryString.name;
}, {authorizationType: 'AWS_IAM'});

//Post-Request zum Erstellen einer Tabelle
api.post('/createTableTest', function (request) {
    var params = {
        TableName : "sensor_12345",
        KeySchema: [
            { AttributeName: "test1", KeyType: "HASH"},  //Partition key
            { AttributeName: "test2", KeyType: "RANGE" }  //Sort key
        ],
        AttributeDefinitions: [
            { AttributeName: "test1", AttributeType: "N" },
            { AttributeName: "test2", AttributeType: "S" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };
    return dataBase.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    }).promise().then(
        //Hier muss nun gewartet werden, bis der Tabellenstatus von "CREATING" auf "ACTIVE" wechselt.
    )

});*/