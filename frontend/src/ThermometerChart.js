import React, {Component} from 'react';
import Thermometer from "./Thermometer";

function getURL(url) {
    let httpreq = new XMLHttpRequest();
    httpreq.open("GET", url, false);
    httpreq.send(null);
    return JSON.parse(httpreq.responseText);
}

export default class ThermometerChart extends Component {
//aktuelle Temperatur, die -268,15 entstehen aus der Umrechnung von Kelvin in Celsius sowie die Transformation in das Thermometer(Das geht intern von 0 bis 35
    current=  getURL("http://api.openweathermap.org/data/2.5/weather?id="+this.props.cityID+"&appid="+this.props.appid)['main']['temp']-273.15;
    styleType= ["red","red","red","red","red",
        "red","red","red","green","green",
        "green","red","red","red","red"];

    render(){
        return (
            <div className="Thermometerchart" >
                <h3>Aktuelle Werte:</h3>
                <div style={{float:"left",width:"100px",height:"335px"}}>
                <Thermometer current={this.current}
                />
                </div>
                <div >
                    <ul style={{padding:"0px,0px,0px,0px",margin:"0px,0px,0px,0px",listStyle:"none"}}>
                        <li style={{color:this.styleType[14], fontSize:"15px",marginBottom:"0.3%"}}>30</li>
                        <li style={{color:this.styleType[13], fontSize:"15px", marginBottom:"0.3%",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[12], fontSize:"15px",marginBottom:"0.3%"}}>25</li>
                        <li style={{color:this.styleType[11], fontSize:"15px", marginBottom:"0.3%",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[10], fontSize:"15px",marginBottom:"0.3%"}}>20</li>
                        <li style={{color:this.styleType[9], fontSize:"15px",  marginBottom:"0.3%",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[8], fontSize:"15px", marginBottom:"0.3%"}}>15</li>
                        <li style={{color:this.styleType[7], fontSize:"15px",  marginBottom:"0.3%",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[6], fontSize:"15px", marginBottom:"0.3%"}}>10</li>
                        <li style={{color:this.styleType[5], fontSize:"15px",  marginBottom:"0.3%",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[4], fontSize:"15px", marginBottom:"0.3%"}}>5</li>
                        <li style={{color:this.styleType[3], fontSize:"15px",  marginBottom:"0.3%",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[2], fontSize:"15px", marginBottom:"0.3%"}}>0</li>
                        <li style={{color:this.styleType[1], fontSize:"15px",  marginBottom:"0.3%",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[0], fontSize:"15px", marginBottom:"0.3%"}}>-5</li>
                    </ul>
                </div>
            </div>
        )
    }
}
