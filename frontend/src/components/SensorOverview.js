import React, {Component} from 'react';
import {Button} from 'semantic-ui-react';
import {API} from "aws-amplify/lib/index";

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensors: []
        }


    }


    componentDidMount() {
        this.accessSensors();
    }

    async accessSensors() {
        let sensors = await this.getSensors();
        console.log(sensors);
        this.setState({
            sensors: JSON.stringify(sensors)
        });
    }

    getSensors() {
        /* let myInit = { // OPTIONAL
             headers: {}, // OPTIONAL
             response: true // OPTIONAL (return entire response object instead of response.data)
         }
         return API.get("strawberry","/hello-world",myInit ) */
        return API.post("strawberry", "/getSensorsForUser", {
            headers:{} ,
            body: {}
        });
    }



    render() {
        var seite;
        if (window.innerWidth>="900"){
            seite= "seite1"}
        else{
            seite="seite2"}
        return (
            <div id={seite}>
                <div>
                    <h1>Sensor Übersicht</h1>
                    <p>{this.state.sensors}</p>
                </div>
            </div>
        );
    }
}