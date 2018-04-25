import React, {Component} from 'react';
import ThermometerChart from "./ThermometerChart";
import ForecastMenu from "./ForecastMenu";
import { Container,Grid,Segment,Header } from "semantic-ui-react";




export default class PlantDetail extends Component{
    constructor(props){
        super(props);
    }
     getParameterByName(name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    render(){
        return (
            <div>
                <Container fluid={true}>
                    <Grid>
                        <Grid.Row >
                            <Segment style={{margin:"0px",width:"70%"}}>
                        <Grid.Column>

                                    <h2>Daten</h2>
                                    <h3> Art: {this.props.plants[this.getParameterByName(("name"))][0]}</h3>
                                    <h4> Einpflanzungszeitpunkt: {this.props.plants[this.getParameterByName(("name"))][1]}</h4>
                                    <h4>Ort: {this.props.plants[this.getParameterByName(("name"))][3]}</h4>
                                    <h4>Temperatur: {this.props.plants[this.getParameterByName(("name"))][4]}</h4>
                                    <br />
                        </Grid.Column>
                            </Segment>
                            <Segment style={{margin:"0px",width:"30%"}}>
                            <Grid.Column width={4} >
                                <ThermometerChart appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297" temp={this.props.plants[this.getParameterByName(("name"))][5]} scopeGreen={this.props.plants[this.getParameterByName(("name"))][6]} scopeYellow={this.props.plants[this.getParameterByName(("name"))][7]}/>
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