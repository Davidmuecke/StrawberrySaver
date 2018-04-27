import React, { Component} from 'react';
import './App.css';
import Routes from "./Routes";
import {withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import NavigationBar from "./components/NavigationBar";
import {API} from "aws-amplify/lib/index";


class App extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            names:"",
            plants:[["Test1","Test2"],["Test3","Test4"],["Test5","Test6"]]
        };

    }

    async componentDidMount() {
        try {
            if (await Auth.currentSession()) {
                this.handleSubmit();
                console.log(Auth.currentSession());
                let user = await Auth.currentAuthenticatedUser();
                let attributes = await  Auth.userAttributes(user);
                this.userHasAuthenticated(true);
            }
        }
        catch(e) {
            console.log("App:ComponentDidMount() "+e);
            /*if (e !== 'No current user') {
                alert(e);
            }*/
            if(this.props.location.pathname !== "/register") {
                this.props.history.push("/login");
            }
        }
        this.setState({ isAuthenticating: false });

    }

    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: authenticated });
    };

    handleLogout = async () => {
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log(err));
        await Auth.signOut();
        this.userHasAuthenticated(false);
        this.props.history.push("/login");
    };
    arduinoTest(note) {
        /* let myInit = { // OPTIONAL
             headers: {}, // OPTIONAL
             response: true // OPTIONAL (return entire response object instead of response.data)
         }
         return API.get("strawberry","/hello-world",myInit ) */
        return API.post("strawberry", "/getPlantsForUser", {
            headers:{} ,
            body: {}
        });
    }
    async handleSubmit() {

        try {
            let reply = await this.arduinoTest({});
            console.log(reply);
            //bearbeitung zu Array
            let outputArray =[];
            let nameArray=[];
            for(let i=0;i<reply.length; i++)
            {
                outputArray.push([reply[i].plantData.sort,reply[i].plantData.plantationTime,reply[i].plantData.initialTimePlant,reply[i].plantData.location_ID,
                    reply[i].measurement.temperatureSensor,reply[i].plantData.perfectTemperature,reply[i].plantData.temperatureScopeGreen,reply[i].plantData.temperatureScopeYellow]);
                nameArray.push(reply[i].plantData.sort);
            }
            this.setState({plants:outputArray});

            //[[reply[0].plantData.sortreply[0].plantData.plantationTime,reply[0].plantData.initialTimePlant,reply[0].plantData.local_position_ID,reply[0].plantData.location_ID],reply[1],reply[2]]});
            //this.setState({answer: reply});
            // Plant(strawberry,reply[0].plantData.sort,0,reply[0].plantData.plantationTime,reply[0].plantData.initialTimePlant,reply[0].plantData.local_position_ID,reply[0].plantData.location_ID)
        } catch (e) {
            alert(e);
        }
    };
    render() {


        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated,
            handleLogout: this.handleLogout,
            pathname:this.props.location.pathname,
            plants: this.state.plants
        };


        return (
            <div>
                {!this.state.isAuthenticating&&
                <div>
                    <div style={{height:"100%"}}><NavigationBar childProps={childProps} /></div>
                    <Routes childProps={childProps}/>
                </div>
                }
            </div>
        );
    }


}
export default withRouter(App);
