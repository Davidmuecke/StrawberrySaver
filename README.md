# StrawberrySaver
Save your strawberries!

# Set up dev environment
## React JS  
- install Node.js LTS 8.10
- install git
- start Node.js command prompt and enter npm install create-react-app
- install jetbrains webstorm
- Further information: https://www.jetbrains.com/help/webstorm/react.html
- start webstorm
- chose check out from VCS and checkout this project
- open the terminal window within webstorm (ALT + F12)
    - cd frontend
    - npm install
- starting the dev server
    - Option A (CMD): in /fronted enter npm start
    - Option B (GUI): Run - Edit Configurations - click the "+" sign and choose "npm" and in the npm view chose command "start" with /frontend/package.json  
    
##Claudia JS
###preparation
- To be installed:
    - Node.js
    - git
    - jetbrains webstorm
- install claudia.js global
    - open cmd.exe 
    - execute `npm install claudia -g`
- verify your claudia installation
    - execute `claudia --version`
- install aws-sdk global
    - open cmd.exe
    - execute `npm install aws-sdk -g`
- configure access credentials to aws
    - navigate to the *.aws-directory* (on Windows: in your user-directory)
    - open the file *credential* in your favorite text editor
    -   insert your **aws_access_key_id** and your **aws_secret_access_key**
            aws_access_key_id = *<aws_access_key_id>*
            aws_secret_access_key = *<aws_secret_access_key>*
- Checkout project from central repository
- open the terminal window within webstorm (ALT + F12)
    - `cd backend`
    - `npm install`
###create new lambda-function
- open the terminal window within webstorm (ALT + F12) and navigate to the backend folder
- execute `claudia create --region us-east-1 --api-module index --policies policy`
    - parameters:
        - region: region to publish the service (please use *us-east-1*)
        - api-module: main .js-file contains the service
        - policies: folder contains the policy-files to use for the service

###update your lambda-function
- open the terminal window within webstorm (ALT + F12) and navigate to the backend folder
 - execute `claudia update` *(duration: ~ 45s.)*
 
 ###test your lambda-function
 ####post-requests
 1. via linux-command: `curl -H "Content-Type: application/json" -X POST -d '<json-object>' <API-URL>/<API-Endpoint>`
 2. HTTP-Requester at the Browser: use your favorite HTTP-requester-browser-plugin to set the Header and the body of your request
 
 ###get-requests
 1. via linux.command: `curl <API-URL>/<API-Endpoint>`
 2. via browser: insert the request-URL in the search-field of your favorite browser
 
 
 ###usefull links
 - use claudia.js
    - [claudia.js on github](https://github.com/claudiajs/claudia)
    - [claudia.js and dynamoDB example 1](https://github.com/claudiajs/example-projects/blob/master/dynamodb-example/index.js)
    - [claudia.js and dynamoDB example 2](https://github.com/claudiajs/example-projects/blob/master/web-api-custom-status-code/web.js)
 - operate on dynamoDB
    - [dynamoDB general introduction](https://docs.aws.amazon.com/de_de/amazondynamodb/latest/developerguide/Introduction.html)
    - [dynamoDB permissions](https://docs.aws.amazon.com/de_de/amazondynamodb/latest/developerguide/api-permissions-reference.html)
    - [dynamoDB query-example](https://docs.aws.amazon.com/de_de/amazondynamodb/latest/APIReference/API_Query.html)
    - [dynamoDB API AttributeValue](https://docs.aws.amazon.com/de_de/amazondynamodb/latest/APIReference/API_AttributeValue.html)
    - [working with dynamoDB](https://docs.aws.amazon.com/de_de/amazondynamodb/latest/developerguide/WorkingWithDynamo.html)
    - [dynamoDB create table](https://docs.aws.amazon.com/de_de/sdk-for-javascript/v2/developer-guide/dynamodb-examples-using-tables.html)
    - [dynamoDB create table properties](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property)
- something else
    - [how to use Markdown](https://support.zendesk.com/hc/de/articles/203691016-Formatieren-von-Text-mit-Markdown#topic_xqx_mvc_43__row_tf4_bmn_1n)
    - 