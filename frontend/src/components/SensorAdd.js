import React, { Component } from "react";
import { Button, Form, Dropdown, Checkbox, Container, Grid } from 'semantic-ui-react'
import {API} from "aws-amplify/lib/index";


export default class SensorAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
                                serialNumer: this.state.SerialNumber
                            },
                            configData:{
                                measuringInterval: this.state.measuringInterval,
                                sendInterval: this.state.sendInterval,
                                sendOnChange: this.state.sendOnChange,
                                batteryLevel: this.state.batteryLevel
                            }
                        }
                });
                this.props.history.push("/");
            } catch (e) {
                alert(e.message);
            }
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
                                <h1>Neuer Sensor</h1>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Field>
                                        <label>SensorID</label>
                                        <input
                                            id={"sensor_ID"}
                                            autoFocus
                                            type={"text"}
                                            value={this.state.sensor_ID}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Seriennummer</label>
                                        <input
                                            id={"serialNumber"}
                                            value={this.state.serialNumber}
                                            onChange={this.handleChange}
                                            type={"text"}
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
                                    >
                                        Erstellen
                                    </Button>
                                </Form>
                            </Grid.Column>
                        </Grid>
                    </Container>
                </div>
            );
        }

}