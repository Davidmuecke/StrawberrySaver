import React, {Component} from 'react';
import {Table, Button} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import {API} from "aws-amplify/lib/index";

export default class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sensors: this.props.sensors.sort()
        }


    }

    componentWillReceiveProps(nextProps){
        this.setState({
            sensors: nextProps.sensors,
        });
    }


  /*componentDidMount() {
        //this.accessSensors();
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
         return API.get("strawberry","/hello-world",myInit )*/
        /* return API.post("strawberry", "/getSensorsForUser", {
            headers:{} ,
            body: {}
        });
    }
*/


    render() {
        let rows =[];
        for(let i=0; i< this.state.sensors.length; i++){
            rows.push(
                <Table.Row>
                    <Table.Cell>{this.state.sensors[i][5]}</Table.Cell>
                    <Table.Cell>{this.state.sensors[i][6]}</Table.Cell>
                    <Table.Cell>{this.state.sensors[i][10]}</Table.Cell>
                    <Table.Cell>{this.state.sensors[i][2] === undefined? "JA" : "NEIN"}</Table.Cell>
                    <Table.Cell><Button as={Link} to={"/sensorEdit?id="+i} color="blue" onClick={this.handleClick} >Bearbeiten</Button></Table.Cell>
                </Table.Row>);
        }
        let seite;
        if (window.innerWidth>="900"){
            seite= "seite1"}
        else{
            seite="seite2"}
        return (
            <div id={seite}>
                <div>
                    <h1>Sensor Übersicht</h1>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>SensorID</Table.HeaderCell>
                                <Table.HeaderCell>Modell</Table.HeaderCell>
                                <Table.HeaderCell>Seriennummer</Table.HeaderCell>
                                <Table.HeaderCell>Verfügbar</Table.HeaderCell>
                                <Table.HeaderCell>Bearbeiten</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {rows}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        );
    }
}