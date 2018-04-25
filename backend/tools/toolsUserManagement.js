/*--------------------------------------------------------------------------------------------------------------------*/
/*                                        Allgemeiner Header                                                          */
/*--------------------------------------------------------------------------------------------------------------------*/
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

/*--------------------------------------------------------------------------------------------------------------------*/
/*                            Wird aufgerufen, wenn sich ein Benutzer anmeldet.                                       */
/*--------------------------------------------------------------------------------------------------------------------*/
function checkUserData(userID) {
    return dynamoDb.scan({ TableName: "userAccess" }).promise().then(function(value) {
            var items = value.Items;
            var users = [];

            items.forEach(function(item) {
                users.push(item.user_ID);
            });

            if(!users.includes(userID)) {
                var params = {
                    TableName :"userAccess",
                    Item:{
                        "user_ID": userID
                    }
                };
                return dynamoDb.put(params).promise().then(function (value) {
                    return "Der User wurde in der Datenbank angelegt.";
                });
            }
            return "Der User exisitert in der Datenbank.";
        });
}
/*--------------------------------------------------------------------------------------------------------------------*/
/*                 footer: zu exportierende Funktionen.                                                               */
/*--------------------------------------------------------------------------------------------------------------------*/
module.exports = {
    checkUserData:checkUserData
};