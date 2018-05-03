import React, { Component } from "react";
import { Button, Form, Dropdown, Checkbox, Container, Grid } from 'semantic-ui-react'
import {API} from "aws-amplify/lib/index";


export default class SensorAdd extends Component {
    constructor(props) {
        super(props);
        if(this.getURLParameterByName(("id"))=== null) {
            this.state = {
                editor: false,
                plant: " ",
                sensor_ID: "",
                make: "DK",
                modelDesignation: "HumidityV1",
                firmwareVersion: "1.0",
                initialCommisioning: "27.04.2018",
                serialNumber: "",
                measuringInterval: 30,
                sendInterval: 300,
                sendOnChange: "true",
                batteryLevel: 100
            }
        } else{
            let i = this.getURLParameterByName(("id"));
            this.state = {
                editor: true,
                internalID: i,
                sensor_ID: this.props.sensors[i][3],
                make: this.props.sensors[i][9],
                modelDesignation: this.props.sensors[i][6],
                firmwareVersion: this.props.sensors[i][7],
                initialCommisioning: this.props.sensors[i][8],
                serialNumber: this.props.sensors[i][10],
                measuringInterval: this.props.sensors[i][0],
                sendInterval: this.props.sensors[i][1],
                sendOnChange: this.props.sensors[i][11],
                batteryLevel: this.props.sensors[i][4],
                plant:  this.props.sensors[i][2]
            }
        }
    }

    getURLParameterByName(name) {
        let url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

        componentDidMount()
        {

        }


        /**
         * Validates form, is called to enable the submit button
         * @returns {boolean}
         */
        validateForm()
        {
            return this.state.sensor_ID.length > 0 && this.state.serialNumber.length > 0 && this.state.measuringInterval > 0 && this.state.sendInterval > 0 && this.state.sendOnChange.length > 0;
        }

        /**
         * onChange event
         * @param event
         */
        handleChange = event => {
            if(event.target.id === "sendOnChange2"){
                this.setState({
                    ["sendOnChange"]: event.target.value
                });
            } else {
                this.setState({
                    [event.target.id]: event.target.value
                });
            }


        };
        /**
         * Submit event
         */
        handleSubmit = async event => {
            event.preventDefault();

            try {
                if(!this.state.editor){
                    API.post("strawberry", "/createSensor", {
                        headers: {},
                        body:
                            {
                                sensor_ID: this.state.sensor_ID,
                                systemData: {
                                    make: this.state.make,
                                    modelDesignation: this.state.modelDesignation,
                                    firmwareVersion: this.state.firmwareVersion,
                                    initialCommisioning: this.state.initialCommisioning,
                                    serialNumber: this.state.serialNumber
                                },
                                configData:{
                                    measuringInterval: this.state.measuringInterval,
                                    sendInterval: this.state.sendInterval,
                                    sendOnChange: this.state.sendOnChange,
                                    batteryLevel: this.state.batteryLevel
                                }
                            }
                    }).then(response => {
                        //console.log("success: "+ response);
                        this.props.renewGlobalPlantData();

                        this.props.history.push("/sensorOverview");
                    }).catch(error => {
                        console.log(error.response);
                    });
                }else {
                    API.post("strawberry", "/updateSensorConfig", {
                        headers: {},
                        body:
                            {
                                sensor_ID: this.state.sensor_ID,
                                configData:{
                                    measuringInterval: this.state.measuringInterval,
                                    sendInterval: this.state.sendInterval,
                                    sendOnChange: this.state.sendOnChange,
                                    batteryLevel: this.state.batteryLevel
                                }
                            }
                    }).then(response => {
                        //console.log("success: "+ response);
                        this.props.renewGlobalPlantData();

                        this.props.history.push("/sensorOverview");
                    }).catch(error => {
                        console.log(error.response);
                    });
                }


            } catch (e) {
                alert(e.message);
            }
        };

        handleDeleteSensor = async event => {
            API.post("strawberry", "/deleteSensor", {
                headers: {},
                body:
                    {
                        sensor_ID: this.state.sensor_ID
                    }
            }).then(response => {
                //console.log("success: "+ response);
                this.props.renewGlobalPlantData();
                this.props.history.push("/sensorOverview");
            }).catch(error => {
                console.log(error.response);
            });
        };

        render()
        {
            var seite;
            if (window.innerWidth>="900"){
                seite= "seite1"}
            else{
                seite="seite2"}
            return (
                <div id={seite}>
                    <Container>
                        <Grid>
                            <Grid.Column width={10} stretched>
                                <h1>{this.state.editor?"Sensor Bearbeiten":"Neuer Sensor"}</h1>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Field>
                                        <label>SensorID</label>
                                        <input
                                            id={"sensor_ID"}
                                            autoFocus
                                            type={"text"}
                                            value={this.state.sensor_ID}
                                            disabled={this.state.editor}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Seriennummer</label>
                                        <input
                                            id={"serialNumber"}
                                            value={this.state.serialNumber}
                                            onChange={this.handleChange}
                                            disabled={this.state.editor}
                                            type={"number"}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Messinterval</label>
                                        <input
                                            id={"measuringInterval"}
                                            value={this.state.measuringInterval}
                                            onChange={this.handleChange}
                                            type={"number"}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>SenderTimeout</label>
                                        <input
                                            id={"sendInterval"}
                                            value={this.state.sendInterval}
                                            onChange={this.handleChange}
                                            type={"number"}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Bei Änderung sofort senden</label>
                                        <Checkbox
                                            radio
                                            label='ja'
                                            id='sendOnChange'
                                            name='checkboxRadioGroup'
                                            value='true'
                                            checked={this.state.sendOnChange === 'true'}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <Checkbox
                                            radio
                                            label='nein'
                                            id='sendOnChange2'
                                            name='checkboxRadioGroup'
                                            value='false'
                                            checked={this.state.sendOnChange === 'false'}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Field>
                                    <Button
                                        disabled={!this.validateForm()}
                                        type="submit"
                                    >{this.state.editor?"Ändern":"Erstellen"}
                                    </Button>
                                    {this.state.editor?<Button
                                        disabled={!(this.state.plant === undefined)}
                                        onClick={this.handleDeleteSensor}
                                        color={"red"}
                                    >Löschen
                                    </Button>:""}

                                </Form>
                            </Grid.Column>
                        </Grid>
                    </Container>
                </div>
            );
        }

}