import React, {Component} from 'react';
import WaterLevel from "./WaterLevel";

function getURL(url) {
    let httpreq = new XMLHttpRequest();
    httpreq.open("GET", url, false);
    httpreq.send(null);
    return JSON.parse(httpreq.responseText);
}

export default class WaterLevelChart extends Component {
    constructor(props){
        super(props);

        let perfectWater= Math.round(Number(this.props.water)/93.09);
        let greenScopeArray= Math.round(Number(this.props.scopeGreen/93.09));
        let yellowScopeArray =Math.round(Number(this.props.scopeYellow/93.09));
        this.styleType[perfectWater-1]="green";
        for(let i=1; i<=greenScopeArray;i++){
            this.styleType[perfectWater+i-1]= "green";
            this.styleType[perfectWater -i-1]="green";

        }
        for(let j=1;j<=yellowScopeArray;j++){
            this.styleType[perfectWater+(greenScopeArray +j)-1]= "#EEC900";
            this.styleType[perfectWater-greenScopeArray -j-1]="#EEC900";
            console.log(perfectWater -greenScopeArray -j);
        }


    }
//aktuelle Temperatur, die -268,15 entstehen aus der Umrechnung von Kelvin in Celsius sowie die Transformation in das Thermometer(Das geht intern von 0 bis 35
    // current=  getURL("http://api.openweathermap.org/data/2.5/weather?id="+this.props.cityID+"&appid="+this.props.appid)['main']['temp']-273.15;
    styleType= ["blue","blue","blue","blue","blue",
        "blue","blue","blue","blue","blue",
        "blue"];
    render(){
        return (
            <div className="Thermometerchart" >
                <h2>Aktueller Wasserstand der Pflanze</h2>

                <div style={{float:"left",width:"100px",height:"305px"}}>
                    <WaterLevel current={parseInt(this.props.liveWater)} greenBorderUp={Number(this.props.water)+this.props.scopeGreen} greenBorderDown={Number(this.props.water)-this.props.scopeGreen}
                                 yellowBorderUp={Number(this.props.water)+this.props.scopeGreen + this.props.scopeYellow} yellowBorderDown={Number(this.props.temp)-this.props.scopeGreen - this.props.scopeYellow} barColor={this.props.barColor}/>
                </div>
                <div>
                    <ul style={{padding:"0px,0px,0px,0px",margin:"0px,0px,0px,0px",listStyle:"none"}}>
                        <li style={{color:this.styleType[10], fontSize:"15px", marginBottom:"2.3%"}}>100%</li>
                        <li style={{color:this.styleType[9], fontSize:"15px",  marginBottom:"2.3%",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[8], fontSize:"15px",  marginBottom:"2.3%"}}>80%</li>
                        <li style={{color:this.styleType[7], fontSize:"15px",  marginBottom:"2.3%",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[6], fontSize:"15px",  marginBottom:"2.3%"}}>60%</li>
                        <li style={{color:this.styleType[5], fontSize:"15px",  marginBottom:"2.3%",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[4], fontSize:"15px",  marginBottom:"2.3%"}}>40%</li>
                        <li style={{color:this.styleType[3], fontSize:"15px",  marginBottom:"2.3%",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[2], fontSize:"15px",  marginBottom:"2.3%"}}>20%</li>
                        <li style={{color:this.styleType[1], fontSize:"15px",  marginBottom:"2.3%",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[0], fontSize:"15px",  marginBottom:"2.3%"}}>0%</li>
                    </ul>
                </div>
            </div>
        )
    }
}
