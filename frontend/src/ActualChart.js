import React, {Component} from 'react';
import {Bar} from 'react-chartjs-2';

function getURL(url){
    let httpreq = new XMLHttpRequest();
    httpreq.open("GET",url,false);
    httpreq.send(null);
    return JSON.parse(httpreq.responseText);
}


class Chart extends Component{
    constructor(props){
        super(props);
        this.state={
            chartData:{
                labels:["Temperatur in °C","Luftfeuchte in %"],
                datasets:[
                    { label: 'Aktuell',
                        data: [
                            getURL("http://api.openweathermap.org/data/2.5/weather?id=2825297&appid=9e875e006011c294e09b4ee38bec12bf")['main']['temp']-273.1,
                            getURL("http://api.openweathermap.org/data/2.5/weather?id=2825297&appid=9e875e006011c294e09b4ee38bec12bf")['main']['humidity']
                        ],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132)',
                        borderWidth: 1
                    }, {
                        label: 'Empfohlen',
                        data: [
                            20,
                            80
                        ],
                        backgroundColor: 'rgba(25, 186, 0)',
                        borderColor: 'rgba(25, 92, 0)',
                        borderWidth: 1
                    }
                ]
            }
        }
    }
    render(){
        return(
            <div className="chart">
                <Bar data={this.state.chartData}
                     options={{maintainAspectRatio:false}}
                />
            </div>
        )
    }
}
export default Chart;