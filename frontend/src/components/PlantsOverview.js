import React, { Component } from 'react';
import "./PlantsOverview.css";
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
    }
    render(){

        var rows=[];
        for(let i=0;i<this.props.plants.length;i++)
        {
            rows.push(Plant(gurke,this.props.plants[i][0], i,this.props.plants[i][1],this.props.plants[i][2],this.props.plants[i][3],this.props.plants[i][3],1,"22°"));
        }

        var seite;
        if (window.innerWidth>="900"){
            seite= "seite1"}
        else{
            seite="seite2"}
        return (
            <div id={seite}>
                <Container fluid={true}>
                <Grid>
                    <Grid.Column width={16} stretched>
                        <Header><h1 id="headerUebersicht">Übersicht</h1></Header>
                        <p>Hier können sie alle registrierten Pflanzen einsehen, klicken Sie auf Details umd die Detailseite der jeweiligen Pflanze aufzurufen</p>
                    </Grid.Column>
                    {rows}
                </Grid>
                </Container>
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
