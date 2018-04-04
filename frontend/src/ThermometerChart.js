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


    render(){
        return (
            <div >
                <div style={{float:"left",width:"100px",height:"345px"}}>
                <Thermometer current={this.current}
                />
                </div>
                <div >
                    <ul style={{padding:"0px,0px,0px,0px",margin:"0px,0px,0px,0px",listStyle:"none"}}>
                        <li style={{color:this.props.styleType[35], fontSize:"15px",marginBottom:"-10px"}}>30</li>
                        <li style={{color:this.props.styleType[34], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[33], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[32], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[31], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[30], fontSize:"15px",marginBottom:"-10px"}}>25</li>
                        <li style={{color:this.props.styleType[29], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[28], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[27], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[26], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[25], fontSize:"15px",marginBottom:"-10px"}}>20</li>
                        <li style={{color:this.props.styleType[24], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[23], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[22], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[21], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[20], fontSize:"15px",marginBottom:"-10px"}}>15</li>
                        <li style={{color:this.props.styleType[19], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[18], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[17], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[16], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[15], fontSize:"15px",marginBottom:"-10px"}}>10</li>
                        <li style={{color:this.props.styleType[14], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[13], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[12], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[11], fontSize:"8px",marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[10], fontSize:"15px",marginBottom:"-10px"}}>5</li>
                        <li style={{color:this.props.styleType[9], fontSize:"8px", marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[8], fontSize:"8px", marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[7], fontSize:"8px", marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[6], fontSize:"8px", marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[5], fontSize:"15px", marginBottom:"-10px"}}>0</li>
                        <li style={{color:this.props.styleType[4], fontSize:"8px", marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[3], fontSize:"8px", marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[2], fontSize:"8px", marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[1], fontSize:"8px", marginBottom:"-10px"}}>-</li>
                        <li style={{color:this.props.styleType[0], fontSize:"15px", marginBottom:"-10px"}}>-5</li>
                    </ul>
                </div>
            </div>
        )
    }
}
