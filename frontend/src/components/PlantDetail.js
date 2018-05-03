import React, {Component} from 'react';
import ThermometerChart from "./ThermometerChart";
import WaterLevelChart from "./WaterLevelChart";
import ForecastMenu from "./ForecastMenu";
import { Button,Divider,Container,Grid,Segment,Header } from "semantic-ui-react";
import {Link} from "react-router-dom";




export default class PlantDetail extends Component{
    constructor(props){
      super(props);

      //console.log(sensorID);

      this.state={sensor:[],date:"",plants:[]};

        if(this.props.plants.length >0){
            let sensorID = this.props.plants[this.getParameterByName(("name"))][9];
            for(let i=0; i<this.props.sensors.length;i++){
                if(this.props.sensors[i][3]===sensorID){
                    this.state ={sensor:this.props.sensors[i],plants:this.props.plants,date:new Date(this.props.plants[this.getParameterByName(("name"))][1])};
                }

            }
        }

    }
    componentWillReceiveProps(nextProps){
        let sensorID = nextProps.plants[this.getParameterByName(("name"))][9];
        for(let i=0; i<nextProps.sensors.length;i++){
            if(nextProps.sensors[i][3]===sensorID){
                this.setState({sensor:nextProps.sensors[i],plants:nextProps.plants});
            }
        }
        this.setState({date:new Date(nextProps.plants[this.getParameterByName(("name"))][1]),plants:nextProps.plants});
    }
     getParameterByName(name) {
        let url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    render(){

        let seite;
        if (window.innerWidth>="900"){
            seite= "seite1"}
        else{
            seite="seite2"}
        return (
            (this.state.plants.length > 0 && this.state.sensor.length>0)&&
            <div id={seite}>
                <Container fluid={true}>
                    <Grid>
                        <Grid.Row >
                            <Segment style={{margin:"0px",width:"50%"}}>
                                <Grid.Column>
                                    <img src={this.state.plants[this.getParameterByName(("name"))][8]} style={{float:"right",width:"30%",height:"100%"}}/>
                                    <h2>{this.state.plants[this.getParameterByName(("name"))][10]}</h2>
                                    <h3> Art: {this.state.plants[this.getParameterByName(("name"))][0]}</h3>
                                    <h4> Einpflanzungszeitpunkt: {this.state.date.toDateString() }</h4>
                                    <h4>Ort: {this.state.plants[this.getParameterByName(("name"))][3]}</h4>
                                </Grid.Column>
                            </Segment>
                            <Segment style={{margin:"0px",width:"50%"}}>
                                <Grid.Column>
                                    {this.state.sensor!==""?
                                        <div>
                                            <h2>Sensordaten</h2>
                                            <h4>Messintervall: {this.state.sensor[0] +" Sekunden"}</h4>
                                            <h4>Sendeintervall: {this.state.sensor[1] +" Sekunden"}</h4>
                                            <h4>Batterieladezustand: {this.state.sensor[4] + " %"}</h4>
                                        </div>
                                        :<div> Keine Sensordaten gefunden </div>
                                    }
                                </Grid.Column>
                            </Segment>
                        </Grid.Row>
                        <Grid.Row>
                            <Segment style={{margin:"0px",width:"50%"}}>
                                <Grid.Column >
                                    <ThermometerChart appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"
                                                      liveTemp={this.state.plants[this.getParameterByName(("name"))][4]}
                                                      temp={this.state.plants[this.getParameterByName(("name"))][5]}
                                                      scopeGreen={this.state.plants[this.getParameterByName(("name"))][6]}
                                                      scopeYellow={this.state.plants[this.getParameterByName(("name"))][7]}
                                                      barColor="red"/>
                                </Grid.Column>
                            </Segment>
                            <Segment style={{margin:"0px",width:"50%"}}>
                                <Grid.Column>
                                    <WaterLevelChart appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"
                                                      liveWater={this.state.plants[this.getParameterByName(("name"))][16]}
                                                      water={this.state.plants[this.getParameterByName(("name"))][12]}
                                                      scopeGreen={this.state.plants[this.getParameterByName(("name"))][13]}
                                                      scopeYellow={this.state.plants[this.getParameterByName(("name"))][14]}
                                                      barColor="blue"/>
                                </Grid.Column>
                            </Segment>
                        </Grid.Row>
                        <Grid.Row>
                                <Segment style={{width:"100%"}}>
                                <ForecastMenu/>
                                </Segment>
                        </Grid.Row>
                        <Grid.Row>
                            <Segment style={{width:"100%"}}>
                                <Button as={Link} to={"/plantEdit?id="+this.getParameterByName(("name"))} color="blue" onClick={this.handleClick}>Ändern</Button>
                            </Segment>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        )
    }
}