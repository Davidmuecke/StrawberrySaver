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
/*                                          Sensor löschen                                                             */
/*---------------------------------------------------------------------------------------------------------------------*/


function conditionalDelete(sensorID) {
    var year = 2015;
    var title = "The Big New Movie";

    var params = {
        TableName:"sensors",
        Key:{
            "sensor_ID":sensorID
        },
        //ConditionExpression:"info.rating <= :val",    //Bedingung, ansonsten wird nicht geköscht
        //ExpressionAttributeValues: {
        //    ":val": 5.0
        //}
    };

    dynamoDb.delete(params, function(err, data) {
        if (err) {
            document.getElementById('textarea').innerHTML = "The conditional delete failed: " + "\n" + JSON.stringify(err, undefined, 2);
        } else {
            document.getElementById('textarea').innerHTML = "The conditional delete succeeded: " + "\n" + JSON.stringify(data, undefined, 2);
        }
    });
}