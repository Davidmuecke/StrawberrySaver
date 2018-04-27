import React, { Component } from "react";
import { Button, Form, Dropdown, Checkbox, Container, Grid } from 'semantic-ui-react'
import {API} from "aws-amplify/lib/index";


export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "MeinePflanze",
            sorte: "Erdbeere",
            plantationTime: "",
            initialPlantationTime: "2018-04-27",
            locationID:"Stuttgart",
            pictureURL:"",
            sensorID:"",
            localPosition:"",
            perfectTemperature:20,
            temperatureScopeGreen:4,
            temperatureScopeYellow:4,
            perfectWater:500,
            waterScopeGreen:200,
            waterScopeYellow:150,
            sensorOptions:"",
            locationOptions:[{
                text: 'Stuttgart',
                value: '2637829'
            },{
                text: 'Frankfurt',
                value: '1222999'
            }]
        };

    }

    componentDidMount(){
        this.getFormOptionsFromServer();
    }

    async getFormOptionsFromServer(){
        let sensorRaw = await  this.getSensors();
        let sensorEdited = [];
        console.log(sensorRaw);
        for(let i=0; i<sensorRaw.length; i++){
            sensorEdited[i] = {text:sensorRaw[i], value: sensorRaw[i], id: 'Sensor:'+sensorRaw[i]};
        }
        console.log(sensorEdited);
        this.setState({
            sensorOptions:sensorEdited
        });
    }

    getSensors() {
        /* let myInit = { // OPTIONAL
             headers: {}, // OPTIONAL
             response: true // OPTIONAL (return entire response object instead of response.data)
         }
         return API.get("strawberry","/hello-world",myInit ) */
        return API.post("strawberry", "/getFreeSensorsForUser", {
            headers:{} ,
            body: {}
        });
    }

    /**
     * Validates form, is called to enable the submit button
     * @returns {boolean}
     */
    validateForm() {
        return this.state.name.length > 0 && this.state.sorte.length > 0 && this.state.sensorID.length > 0 && this.state.pictureURL.length > 0
            && this.state.localPosition.length >0 && this.state.locationID > 0;
    }

    /**
     * onChange event
     * @param event
     */
    handleChange = event => {
       // console.log(event.target.id+" : "+event.target.value+" : "+event.target.name);
        if(event.target.id === "localPosition2" ||event.target.id === "localPosition3"){
            this.setState({
                ["localPosition"]: event.target.value
            });
        } else if(event.target.id.startsWith('Sensor:')){
            this.setState({
                ["sensorID"]: event.target.id.substr(7)
            });
        } else {
            this.setState({
                [event.target.id]: event.target.value
            });
        }

    }
    /**
     * Submit event
     */
    handleSubmit = async event => {
        event.preventDefault();

        try {
            API.post("strawberry", "/createPlant", {
                headers:{} ,
                body:
                    {
                    plantData: {
                        nickname: this.state.name,
                        pictureURL: this.state.pictureURL,
                        sort: this.state.sorte,
                        plantationTime: this.state.plantationTime,
                        initialTimePlant: this.state.initialPlantationTime,
                        location_ID: this.state.locationID,
                        local_position_ID: this.state.localPosition,
                        sensor_ID: this.state.sensorID,
                        perfectTemperature: this.state.perfectTemperature,
                        temperatureScopeGreen: this.state.temperatureScopeGreen,
                        temperatureScopeYellow: this.state.temperatureScopeYellow,
                        perfectWater: this.state.perfectWater,
                        waterScopeGreen: this.state.waterScopeGreen,
                        waterScopeYellow: this.state.waterScopeYellow
                    }
                }
            });
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
        }
    }

    render() {

        return (
            <Container >
                <Grid>
                <Grid.Column width={10} stretched>
                    <h1>Neue Pflanze</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field >
                        <label>Name</label>
                        <input
                            id={"name"}
                            autoFocus
                            type={"text"}
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Sorte</label>
                        <input
                            id={"sorte"}
                            value={this.state.sorte}
                            onChange={this.handleChange}
                            type={"text"}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Pflanzzeitpunkt</label>
                        <input
                            id={"plantationTime"}
                            value={this.state.plantationTime}
                            onChange={this.handleChange}
                            type={"date"}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Bild URL</label>
                        <input
                            id={"pictureURL"}
                            value={this.state.pictureURL}
                            onChange={this.handleChange}
                            type={"text"}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Senor</label>
                        <Dropdown placeholder='Select Sensor' fluid selection options={this.state.sensorOptions} onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Standort</label>
                        <Dropdown placeholder='Standort auswählen' fluid selection options={this.state.locationOptions} onChange={this.handleChange}/>
                    </Form.Field>
                    <Form.Field>
                        <label>lokaler Standort</label>
                        <Checkbox
                            radio
                            label='draußen'
                            id='localPosition'
                            name='checkboxRadioGroup'
                            value='0'
                            checked={this.state.localPosition === '0'}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            radio
                            label='überdacht'
                            id='localPosition2'
                            name='checkboxRadioGroup'
                            value='1'
                            checked={this.state.localPosition === '1'}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Checkbox
                            radio
                            label='drinnen'
                            id='localPosition3'
                            name='checkboxRadioGroup'
                            value='2'
                            checked={this.state.localPosition === '2'}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>optimale Temperatur</label>
                        <input
                            id={"perfectTemperature"}
                            value={this.state.perfectTemperature}
                            onChange={this.handleChange}
                            type={"number"}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Abweichung Temperatur Grün</label>
                        <input
                            id={"temperatureScopeGreen"}
                            value={this.state.temperatureScopeGreen}
                            onChange={this.handleChange}
                            type={"number"}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Abweichung Temperatur Gelb</label>
                        <input
                            id={"temperatureScopeYellow"}
                            value={this.state.temperatureScopeYellow}
                            onChange={this.handleChange}
                            type={"number"}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>optimale Feuchtigkeit</label>
                        <input
                            id={"perfectWater"}
                            value={this.state.perfectWater}
                            onChange={this.handleChange}
                            type={"number"}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Abweichung Feuchtigkeit Grün</label>
                        <input
                            id={"waterScopeGreen"}
                            value={this.state.waterScopeGreen}
                            onChange={this.handleChange}
                            type={"number"}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Abweichung Feuchtigkeit Gelb</label>
                        <input
                            id={"waterScopeYellow"}
                            value={this.state.waterScopeYellow}
                            onChange={this.handleChange}
                            type={"number"}
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
        );
    }
}