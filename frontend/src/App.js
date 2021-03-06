import React, {Component} from 'react';
import './App.css';
import Routes from "./Routes";
import {withRouter} from "react-router-dom";
import {Auth} from "aws-amplify";
import NavigationBar from "./components/NavigationBar";
import {API} from "aws-amplify/lib/index";
import {Loader} from "semantic-ui-react";
import 'react-circular-progressbar/dist/styles.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            loaded: false,
        };

    }

    async componentDidMount() {
        try {
            if (await Auth.currentSession()) {
                this.handleSubmit();
                this.userHasAuthenticated(true);
            }
        }
        catch (e) {
            //console.log("App:ComponentDidMount() "+e);
            /*if (e !== 'No current user') {
                alert(e);
            }*/
            this.setState({loaded: true});
            if (this.props.location.pathname !== "/register") {
                this.props.history.push("/login");
            }
        }

        this.setState({
            isAuthenticating: false,
            plants: [],
            sensors: []
        });


    }

    userHasAuthenticated = authenticated => {
        this.setState({isAuthenticated: authenticated});
    };

    handleLogout = async () => {
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log(err));
        await Auth.signOut();
        this.userHasAuthenticated(false);
        this.props.history.push("/login");
    };

    getPlantsFromAPI() {
        /* let myInit = { // OPTIONAL
             headers: {}, // OPTIONAL
             response: true // OPTIONAL (return entire response object instead of response.data)
         }
         return API.get("strawberry","/hello-world",myInit ) */
        return API.post("strawberry", "/getPlantsForUser", {
            headers: {},
            body: {}
        });
    };

    getSensorsFromAPI() {

        return API.post("strawberry", "/getSensorsForUser", {
            headers: {},
            body: {}
        });
    };

    /**
     * get global plant and sensor data from API
     */
    handleSubmit = async () => {

        try {
            let reply = await this.getPlantsFromAPI({});
            let sensors = await this.getSensorsFromAPI({});
            //bearbeitung zu Array
            let outputArray = [];
            let nameArray = [];
            let sensorArray = [];
            for (let i = 0; i < reply.length; i++) {
                /*0*/
                outputArray.push([reply[i].plantData.sort, reply[i].plantData.plantationTime, reply[i].plantData.initialTimePlant, reply[i].plantData.location_ID,
                    /*4*/    reply[i].measurement.temperatureSensor, reply[i].plantData.perfectTemperature, reply[i].plantData.temperatureScopeGreen,
                    /*7*/   reply[i].plantData.temperatureScopeYellow, reply[i].plantData.pictureURL, reply[i].plantData.sensor_ID,
                    /*10*/   reply[i].plantData.nickname, reply[i].plantData.local_position_ID, reply[i].plantData.perfectWater, reply[i].plantData.waterScopeGreen,
                    /*14*/    reply[i].plantData.waterScopeYellow, reply[i].plant_ID, reply[i].measurement.humiditySensor]);
                nameArray.push(reply[i].plantData.sort);

            }
            for (let j = 0; j < sensors.length; j++) {
                sensorArray.push([
                    /*0*/          sensors[j].configData.measuringInterval, sensors[j].configData.sendInterval,
                    /*2*/          sensors[j].configData.plant_ID, sensors[j].sensor_ID, sensors[j].configData.batteryLevel,
                    /*5*/          sensors[j].sensor_ID, sensors[j].systemData.modelDesignation, sensors[j].systemData.firmwareVersion,
                    /*8*/          sensors[j].systemData.initialCommisioning, sensors[j].systemData.make, sensors[j].systemData.serialNumber,
                    sensors[j].configData.sendOnChange
                ]);
            }
            this.setState({
                plants: outputArray,
                sensors: sensorArray,
                loaded: true
            });
        } catch (e) {
            if(this.state.isAuthenticated) {
                console.log(e);
            }
        }

    };

    render() {


        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated,
            handleLogout: this.handleLogout,
            renewGlobalPlantData: this.handleSubmit,
            pathname: this.props.location.pathname,
            plants: this.state.plants,
            sensors: this.state.sensors
        };


        return (
            <div>
                {(!this.state.isAuthenticating && this.state.loaded) ?
                    <div>
                        <div style={{height: "100%"}}><NavigationBar childProps={childProps}/></div>
                        <Routes childProps={childProps}/>
                    </div> :
                    <div><Loader inverted>Loading</Loader></div>
                }
            </div>
        );
    }


}

export default withRouter(App);
