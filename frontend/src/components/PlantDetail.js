import React, {Component} from 'react';
import ThermometerChart from "./ThermometerChart";
import ForecastMenu from "./ForecastMenu";
import { Container,Grid,Segment,Header } from "semantic-ui-react";




export default class PlantDetail extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div>
                <Container fluid={true}>
                    <Grid>
                        <Grid.Row >
                            <Segment style={{margin:"0px",width:"70%"}}>
                        <Grid.Column  >

                                    <h2>Daten</h2>
                                    <h3> Art: Erdbeere</h3>
                                    <h4> Einpflanzungszeitpunkt: 45</h4>
                                    <h4>Ort: Stuttgart</h4>
                                    <h4>Temperatur: 8</h4>
                                    <br />
                        </Grid.Column>
                            </Segment>
                            <Segment style={{margin:"0px",width:"30%"}}>
                            <Grid.Column width={4} >
                                <ThermometerChart appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"/>
                            </Grid.Column>
                            </Segment>
                        </Grid.Row>
                        <Grid.Row>
                                <Segment style={{width:"100%"}}>
                                <ForecastMenu/>
                                </Segment>
                        </Grid.Row>
                    </Grid>






                </Container>
            </div>
        )
    }
}