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
 1. via linux-command
 - 
        

    
    