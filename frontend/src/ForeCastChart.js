import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

function getURL(url){
    let httpreq = new XMLHttpRequest();
    httpreq.open("GET",url,false);
    httpreq.send(null);
    return JSON.parse(httpreq.responseText);
}

class LineChart extends Component{
    constructor(props){
        super(props);
        this.state={
            chartData:{
                labels:['0','3','6','9','12'],
                datasets:[
                    { label: 'Temperatur',
                        data: [
                            getURL("http://api.openweathermap.org/data/2.5/forecast?id=2825297&appid=9e875e006011c294e09b4ee38bec12bf")['list'][0]['main']['temp']-273.1,
                            getURL("http://api.openweathermap.org/data/2.5/forecast?id=2825297&appid=9e875e006011c294e09b4ee38bec12bf")['list'][1]['main']['temp']-273.1,
                            getURL("http://api.openweathermap.org/data/2.5/forecast?id=2825297&appid=9e875e006011c294e09b4ee38bec12bf")['list'][2]['main']['temp']-273.1,
                            getURL("http://api.openweathermap.org/data/2.5/forecast?id=2825297&appid=9e875e006011c294e09b4ee38bec12bf")['list'][3]['main']['temp']-273.1,
                            getURL("http://api.openweathermap.org/data/2.5/forecast?id=2825297&appid=9e875e006011c294e09b4ee38bec12bf")['list'][4]['main']['temp']-273.1,
                        ],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132)',
                        borderWidth: 1
                    }
                ]
            },
            chartOptions:{
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Temperatur in °C'
                            },

                        }],
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString:'Zeit in Stunden'
                            }
                        }]
                    },
                    maintainAspectRatio:false
            }
        }

    }
    render(){
        return(
            <div className="chart">
                <Line data={this.state.chartData}
                     options={this.state.chartOptions}
                />
            </div>
        )
    }
}
export default LineChart;