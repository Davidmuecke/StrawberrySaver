import React, { Component } from 'react';
import {Grid,
        Segment,
        Button,
        Header,
        Container,
        Label} from "semantic-ui-react";
import strawberry from './img/strawbarry.png';
import gurke from './img/gurke.png';
import haze from './img/supersilverhaze.png';
export default class Uebersicht extends Component{
    render(){
        return (
            <Container fluid={true}>
            <Grid>
                <Grid.Column width={16} stretched>
                    <Header as='h1'>Uebersicht</Header>
                    <p>Hier können sie alle registrierten Pflanzen einsehen, klicken Sie auf Details umd die Detailseite der jeweiligen Pflanze aufzurufen</p>
                </Grid.Column>
                {Plant(strawberry,"Erdbeere", 0,"01.04.18","01.04.18","Stuttgart","draussen",0,"20°")}
                {Plant(gurke,"Gurke", 1,"01.04.18","01.04.18","Stuttgart","drinnen",1,"22°")}
                {Plant(haze,"Super Silver Haze", 2,"01.05.18","01.04.18","Duisburg","draussen",2,"25°")}
            </Grid>
            </Container>
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
                <img style={{float:"right"}} src={image}/>
                <h2> Art: {sorte}</h2>
                <h4> Einpflanzungszeitpunkt: {einpflanzungszeitpunkt}</h4>
                <h4>Ort: {geographischerOrt}</h4>
                <h4>Temperatur: {temperaturwert}</h4>

                <br />
                <Button color="blue" onClick={this.handleClick}> Details </Button>
            </Segment>
        </Grid.Column>
    );
};
