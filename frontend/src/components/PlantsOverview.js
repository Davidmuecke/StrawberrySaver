import React, { Component } from 'react';
import "./PlantsOverview.css";
import "./style_test.css";

import {Grid,
        Segment,
        Button,
        Header,
        Container
        } from "semantic-ui-react";
import gurke from '../img/gurke.png';
import {API} from "aws-amplify/lib/index";
import { Link } from "react-router-dom";
export default class PlantsOverview extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            content: "Hallo",
            answer: [["test"],["Test2"]]
        };

        this.handleSubmit();

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
            this.setState({answer:outputArray});
            this.props.callback(nameArray);
            this.props.getPlants(outputArray);
            //[[reply[0].plantData.sortreply[0].plantData.plantationTime,reply[0].plantData.initialTimePlant,reply[0].plantData.local_position_ID,reply[0].plantData.location_ID],reply[1],reply[2]]});
            //this.setState({answer: reply});
           // Plant(strawberry,reply[0].plantData.sort,0,reply[0].plantData.plantationTime,reply[0].plantData.initialTimePlant,reply[0].plantData.local_position_ID,reply[0].plantData.location_ID)
        } catch (e) {
            alert(e);
        }
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

    render(){

        var rows=[];
        for(let i=0;i<this.state.answer.length;i++)
        {
            rows.push(Plant(gurke,this.state.answer[i][0], i,this.state.answer[i][1],this.state.answer[i][2],this.state.answer[i][3],this.state.answer[i][3],1,"22°"));
        }
        var seite;
        if (window.innerWidth>="900"){
            seite= "seite1"}
        else{
            seite="seite2"}
        return (
            <div id={seite}>
                <div id="seite">
                <Container fluid={true}>
                <Grid>
                    <Grid.Column width={16} stretched>
                        <Header><h1 id="headerUebersicht">Übersicht</h1></Header>
                        <p>Hier können sie alle registrierten Pflanzen einsehen, klicken Sie auf Details umd die Detailseite der jeweiligen Pflanze aufzurufen</p>
                    </Grid.Column>
                    {rows}
                    <p>{console.log(this.state.answer)}</p>
                </Grid>
                </Container>
                </div>
            </div>
        )
    }

}
//lokale position(draussen,drinnen
//fehlen noch ,temperaturabweichunggrün,temperaturabweichunggelb,wasserabweichunggrün,wasserabweichunggelb
const Plant = (image,sorte, id, einpflanzungszeitpunkt,erstellungszeitpunkt,geographischerOrt,lokaleposition,sensorid,temperaturwert) =>
{
    Component.handleClick = (e) => {};
    return (
        <Grid.Column width={8} stretched >
            <Segment>
                <img id="plantImage"  src={image} alt={""}/>
                <h2> Art: {sorte}</h2>
                <h4> Einpflanzungszeitpunkt: {einpflanzungszeitpunkt}</h4>
                <h4>Ort: {geographischerOrt}</h4>
                <h4>Temperatur: {temperaturwert}</h4>

                <br />
                <Button as={Link} to={"/plantDetail?name="+id} color="blue" onClick={this.handleClick}> Details </Button>
            </Segment>
        </Grid.Column>
    );
};
