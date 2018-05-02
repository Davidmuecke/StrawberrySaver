import React, { Component} from 'react';
import './App.css';
import Routes from "./Routes";
import {withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import NavigationBar from "./components/NavigationBar";
import {API} from "aws-amplify/lib/index";
import {Loader} from "semantic-ui-react";


class App extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
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
        this.setState({ isAuthenticating: false,
                        plants:[],
                        sensors: []
                        });


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

    getPlantsFromAPI(note) {
        /* let myInit = { // OPTIONAL
             headers: {}, // OPTIONAL
             response: true // OPTIONAL (return entire response object instead of response.data)
         }
         return API.get("strawberry","/hello-world",myInit ) */
        return API.post("strawberry", "/getPlantsForUser", {
            headers:{} ,
            body: {}
        });
    };

    getSensorsFromAPI(note) {

        return API.post("strawberry", "/getSensorsForUser", {
            headers:{} ,
            body: {}
        });
    };

    handleSubmit = async () => {

        try {
            let reply = await this.getPlantsFromAPI({});
            let sensors = await this.getSensorsFromAPI({});
            //bearbeitung zu Array
            let outputArray =[];
            let nameArray=[];
            let sensorArray=[];
            for(let i=0;i<reply.length; i++)
            {
                /*0*/  outputArray.push([reply[i].plantData.sort, reply[i].plantData.plantationTime, reply[i].plantData.initialTimePlant, reply[i].plantData.location_ID,
                /*4*/    reply[i].measurement.temperatureSensor, reply[i].plantData.perfectTemperature, reply[i].plantData.temperatureScopeGreen,
                /*7*/   reply[i].plantData.temperatureScopeYellow, reply[i].plantData.pictureURL, reply[i].plantData.sensor_ID,
                /*10*/   reply[i].plantData.nickname, reply[i].plantData.local_position_ID, reply[i].plantData.perfectWater, reply[i].plantData.waterScopeGreen,
                /*14*/    reply[i].plantData.waterScopeYellow, reply[i].plant_ID, reply[i].measurement.humiditySensor] );
                nameArray.push(reply[i].plantData.sort);

            }
            for(let j=0; j< sensors.length;j++){
                sensorArray.push([
                                sensors[j].configData.measuringInterval, sensors[j].configData.sendInterval,
                                sensors[j].configData.plant_ID,sensors[j].sensor_ID,sensors[j].configData.batteryLevel,
                                sensors[j].sensor_ID,  sensors[j].systemData.modelDesignation, sensors[j].systemData.firmwareVersion,
                                sensors[j].systemData.initialCommisioning, sensors[j].systemData.make, sensors[j].systemData.serialNumber
                                ]);
            }
            this.setState({
                plants:outputArray,
                sensors:sensorArray
            });
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
            renewGlobalPlantData: this.handleSubmit,
            pathname:this.props.location.pathname,
            plants: this.state.plants,
            sensors: this.state.sensors
        };


        return (
            <div>
                {(!this.state.isAuthenticating && this.state.sensors && this.state.plants)?
                <div>
                    <div style={{height:"100%"}}><NavigationBar childProps={childProps} /></div>
                    <Routes childProps={childProps}/>
                </div>:<Loader inverted>Loading</Loader>
                }
            </div>
        );
    }


}
export default withRouter(App);
