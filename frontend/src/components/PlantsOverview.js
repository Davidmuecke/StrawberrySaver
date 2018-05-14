import React, { Component } from 'react';
import "./PlantsOverview.css";
import {Grid,
        Segment,
        Button,
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

        let rows=[];
        for(let i=0;i<this.props.plants.length;i++)
        {
            rows.push(Plant(this.state.plants[i][8],this.state.plants[i][0], i,Math.round(this.state.plants[i][16]/10.24*100)/100,this.state.plants[i][2],this.state.plants[i][3],this.state.plants[i][3],1,this.state.plants[i][4]+"°",this.state.plants[i][10]));
        }

        let page;
        if (window.innerWidth>="900"){
            page= "seite1"}
        else{
            page="seite2"}
        return (
            <div id={page}>
                <Container fluid={true}>
                <Grid>
                    <Grid.Column width={16} stretched>
                        <h1>Pflanzen</h1>
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
const Plant = (image,sorte, id, wasserstand,erstellungszeitpunkt,geographischerOrt,lokaleposition,sensorid,temperaturwert,nickname) =>
{
    Component.handleClick = (e) => {};
    return (
            <Grid.Column width={8} key={id} stretched >
                <Segment>
                    <h2> Name: {nickname}</h2>
                    <h4> Art: {sorte}</h4>
                    <h4>Ort: {geographischerOrt}</h4>
                    <img src={image} alt={"Bild von "+nickname} style={{float:"right",width:"30%",height:"100%"}}/>
                    <h4> Wasserstand: {wasserstand +" %"}</h4>
                    <h4>Temperatur: {temperaturwert}</h4>
                    <br />
                    <Button as={Link} to={"/plantDetail?name="+id} color="blue" onClick={this.handleClick}> Details </Button>
                </Segment>
            </Grid.Column>
    );
};
