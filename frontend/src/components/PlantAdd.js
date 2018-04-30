import React, { Component } from "react";
import { Button, Form, Dropdown, Checkbox, Container, Grid } from 'semantic-ui-react'
import {API} from "aws-amplify/lib/index";


export default class Login extends Component {
    constructor(props) {
        super(props);
        if(this.getURLParameterByName(("id"))=== null)
        {
            this.state = {
                edit: null,
                dbID: null,
                name: "MeinePflanze",
                sorte: "Erdbeere",
                plantationTime: "",
                initialPlantationTime: "2018-04-27",
                locationID: "Stuttgart",
                pictureURL: "",
                sensorID: "",
                localPosition: "",
                perfectTemperature: 20,
                temperatureScopeGreen: 4,
                temperatureScopeYellow: 4,
                perfectWater: 500,
                waterScopeGreen: 200,
                waterScopeYellow: 150,
                sensorOptions: "",
                locationOptions: [{
                    text: 'Stuttgart',
                    value: '2637829',
                    active: true
                }]
            };
        } else {
            let id = this.getURLParameterByName(("id"));
            this.state = {
                edit: id,
                dbID: this.props.plants[id][15],
                name: this.props.plants[id][10],
                sorte: this.props.plants[id][0],
                plantationTime: this.props.plants[id][1],
                initialPlantationTime:  this.props.plants[id][2],
                locationID:  this.props.plants[id][3],
                pictureURL:  this.props.plants[id][8],
                sensorID:  this.props.plants[id][9],
                localPosition: this.props.plants[id][11],
                perfectTemperature: this.props.plants[id][5],
                temperatureScopeGreen: this.props.plants[id][6],
                temperatureScopeYellow: this.props.plants[id][7],
                perfectWater: this.props.plants[id][12],
                waterScopeGreen: this.props.plants[id][13],
                waterScopeYellow: this.props.plants[id][14],
                sensorOptions: "",
                locationOptions: [{
                    text: 'Stuttgart',
                    value: '2637829'
                }]
            };
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

    componentDidMount(){
        this.getFormOptionsFromServer(this.state.edit);
    }

    async getFormOptionsFromServer(plantID){
        let sensorRaw = await  this.getSensors();
        let sensorEdited = [];
        //console.log(sensorRaw);
        for(let i=0; i<sensorRaw.length; i++){
            sensorEdited[i] = {text:sensorRaw[i], value: sensorRaw[i], id: 'Sensor:'+sensorRaw[i]};
        }
        if(plantID !== null){
            sensorEdited.push({text: this.props.plants[plantID][9], value: this.props.plants[plantID][9], id: 'Sensor:'+this.props.plants[plantID][9]});
        }
        //console.log(sensorEdited);
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
            && this.state.locationID.length > 0;
    }

    /**
     * onChange event
     * @param event
     */
    handleChange = event => {
       // console.log(event.target.id+" : "+event.target.value+" : "+event.target.name);
        if(event.target.id === "localPosition2" ||event.target.id === "localPosition3"){
            this.setState({
                localPosition: event.target.value
            });
        } else if(event.target.id.startsWith('Sensor:')){
            this.setState({
                sensorID: event.target.id.substr(7)
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
        if(this.state.edit === null)
        {
            try {
                API.post("strawberry", "/createPlant", {
                    headers: {},
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
                }).then(response => {
                    console.log("success: "+ response);
                    this.props.renewGlobalPlantData();
                    this.props.history.push("/");
                }).catch(error => {
                    console.log(error.response);
                });

            } catch (e) {
                alert(e.message);
            }
        } else {
            try {
                API.post("strawberry", "/updatePlantData", {
                    headers: {},
                    body:
                        {
                            plant_ID: this.state.dbID,
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
                }).then(response => {
                    console.log("success: "+ response);
                    this.props.renewGlobalPlantData();
                    this.props.history.push("/");
                }).catch(error => {
                    console.log(error.response);
                });

            } catch (e) {
                alert(e.message);
            }
        }
    };

    render() {
        var seite;
        if (window.innerWidth>="900"){
            seite= "seite1"}
        else{
            seite="seite2"}
        return (
            <div id={seite}>
                <Container >
                    <Grid>
                    <Grid.Column width={10} stretched>
                        {this.props.edit === null ? <h1>Neue Pflanze</h1> : <h1>Pflanze Bearbeiten</h1>}
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
                            {this.state.edit === null ? "Erstellen" : "Änderung speichern" }
                        </Button>
                    </Form>
                    </Grid.Column>
                    </Grid>
                </Container>
            </div>
        );
    }
}