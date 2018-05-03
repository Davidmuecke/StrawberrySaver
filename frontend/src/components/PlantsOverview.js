import React, { Component } from 'react';
import "./PlantsOverview.css";
import {Grid,
        Segment,
        Button,
        Header,
        Container
        } from "semantic-ui-react";
import { Link } from "react-router-dom";
export default class PlantsOverview extends Component{
    constructor(props) {
        super(props);
        this.state={plants:this.props.plants};
    }
    componentWillReceiveProps(nextProps){
        this.setState({plants:nextProps.plants});
    }
    render(){

        var rows=[];
        for(let i=0;i<this.props.plants.length;i++)
        {
            rows.push(Plant(this.state.plants[i][8],this.state.plants[i][0], i,Math.round(this.state.plants[i][16]/10.24*100)/100,this.state.plants[i][2],this.state.plants[i][3],this.state.plants[i][3],1,this.state.plants[i][4]+"°"));
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
                        <p>Hier können sie alle registrierten Pflanzen einsehen, klicken Sie auf Details um die Detailseite der jeweiligen Pflanze aufzurufen</p>
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
const Plant = (image,sorte, id, wasserstand,erstellungszeitpunkt,geographischerOrt,lokaleposition,sensorid,temperaturwert) =>
{
    Component.handleClick = (e) => {};
    return (
            <Grid.Column width={8} stretched >
                <Segment>
                    <h2> Art: {sorte}</h2>
                    <h4>Ort: {geographischerOrt}</h4>
                    <img src={image} style={{float:"right",width:"30%",height:"100%"}}/>
                    <h4> Wasserstand: {wasserstand +" %"}</h4>
                    <h4>Temperatur: {temperaturwert}</h4>
                    <br />
                    <Button as={Link} to={"/plantDetail?name="+id} color="blue" onClick={this.handleClick}> Details </Button>
                </Segment>
            </Grid.Column>
    );
};
