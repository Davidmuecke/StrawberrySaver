import React, {Component} from 'react';
import ThermometerChart from "./ThermometerChart";
import WaterLevelChart from "./WaterLevelChart";
import ForecastMenu from "./ForecastMenu";
import { Button,Divider,Container,Grid,Segment,Header } from "semantic-ui-react";
import {Link} from "react-router-dom";




export default class PlantDetail extends Component{
    constructor(props){
      super(props);
      let sensorID = this.props.plants[this.getParameterByName(("name"))][9];
      //console.log(sensorID);

      this.state={sensor:""};
      for(let i=0; i<this.props.sensors.length;i++){
          if(this.props.sensors[i][3]===sensorID)this.state={sensor:this.props.sensors[i]}

        }
        if(this.state.sensor==="")alert("No Sensor defined for this plant");
      console.log(this.state.sensor);
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
        let date = new Date(this.props.plants[this.getParameterByName(("name"))][1]);
        let seite;
        if (window.innerWidth>="900"){
            seite= "seite1"}
        else{
            seite="seite2"}
        return (
            <div id={seite}>
                <Container fluid={true}>
                    <Grid>
                        <Grid.Row >
                            <Segment style={{margin:"0px",width:"50%"}}>
                                <Grid.Column>
                                    <img src={this.props.plants[this.getParameterByName(("name"))][8]} style={{float:"right",width:"30%",height:"100%"}}/>
                                    <h2>{this.props.plants[this.getParameterByName(("name"))][10]}</h2>
                                    <h3> Art: {this.props.plants[this.getParameterByName(("name"))][0]}</h3>
                                    <h4> Einpflanzungszeitpunkt: {date.toDateString() }</h4>
                                    <h4>Ort: {this.props.plants[this.getParameterByName(("name"))][3]}</h4>
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
                                                      liveTemp={this.props.plants[this.getParameterByName(("name"))][4]}
                                                      temp={this.props.plants[this.getParameterByName(("name"))][5]}
                                                      scopeGreen={this.props.plants[this.getParameterByName(("name"))][6]}
                                                      scopeYellow={this.props.plants[this.getParameterByName(("name"))][7]}
                                                      barColor="red"/>
                                </Grid.Column>
                            </Segment>
                            <Segment style={{margin:"0px",width:"50%"}}>
                                <Grid.Column>
                                    <WaterLevelChart appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"
                                                      liveWater={this.props.plants[this.getParameterByName(("name"))][16]}
                                                      water={this.props.plants[this.getParameterByName(("name"))][12]}
                                                      scopeGreen={this.props.plants[this.getParameterByName(("name"))][13]}
                                                      scopeYellow={this.props.plants[this.getParameterByName(("name"))][14]}
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