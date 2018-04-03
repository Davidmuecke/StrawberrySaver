import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import { Tab } from "semantic-ui-react";

function getURL(url){
    let httpreq = new XMLHttpRequest();
    httpreq.open("GET",url,false);
    httpreq.send(null);
    return JSON.parse(httpreq.responseText);
}

class LineChart extends Component{
    constructor(props){
        super(props);
        var time = new Date(getURL("http://api.openweathermap.org/data/2.5/forecast?id="+this.props.cityID+"&appid="+this.props.appid)['list'][0]['dt']);
        time.getTimezoneOffset();
        if(this.props.type==="temp"){
            this.state={
                chartData:{
                    labels:[(time.getHours()-6)+":00",(time.getHours()-3)+":00",(time.getHours())+":00",(time.getHours()+3)+":00",(time.getHours()+6)+":00"],
                    datasets:[
                        { label: 'Temperatur',
                            data: [
                                getURL("http://api.openweathermap.org/data/2.5/forecast?id="+this.props.cityID+"&appid="+this.props.appid)['list'][0]['main']['temp']-273.1,
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
        else if(this.props.type==="rain"){
            this.state={
                chartData:{
                    labels:[0,3,6,9,12],
                    datasets:[
                        { label: 'Regen',
                            data: [
                                getURL("http://api.openweathermap.org/data/2.5/forecast?id="+this.props.cityID+"&appid="+this.props.appid)['list'][0]['rain']===undefined?"0":getURL("http://api.openweathermap.org/data/2.5/forecast?id="+this.props.cityID+"&appid="+this.props.appid)['list'][0]['rain']['3h'],
                                getURL("http://api.openweathermap.org/data/2.5/forecast?id="+this.props.cityID+"&appid="+this.props.appid)['list'][1]['rain']===undefined?"0":getURL("http://api.openweathermap.org/data/2.5/forecast?id="+this.props.cityID+"&appid="+this.props.appid)['list'][1]['rain']['3h'],
                                getURL("http://api.openweathermap.org/data/2.5/forecast?id="+this.props.cityID+"&appid="+this.props.appid)['list'][2]['rain']===undefined?"0":getURL("http://api.openweathermap.org/data/2.5/forecast?id="+this.props.cityID+"&appid="+this.props.appid)['list'][2]['rain']['3h'],
                                getURL("http://api.openweathermap.org/data/2.5/forecast?id="+this.props.cityID+"&appid="+this.props.appid)['list'][3]['rain']===undefined?"0":getURL("http://api.openweathermap.org/data/2.5/forecast?id="+this.props.cityID+"&appid="+this.props.appid)['list'][3]['rain']['3h'],
                                getURL("http://api.openweathermap.org/data/2.5/forecast?id="+this.props.cityID+"&appid="+this.props.appid)['list'][4]['rain']===undefined?"0":getURL("http://api.openweathermap.org/data/2.5/forecast?id="+this.props.cityID+"&appid="+this.props.appid)['list'][4]['rain']['3h'],
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
                                labelString: 'Niederschlag in mm'
                            },

                        }],
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString:'Zeit in Stunden'
                            }
                        }]
                    },

                }
            }
        }


    }
    render(){
        return(
                <Line data={this.state.chartData}
                     options={this.state.chartOptions}
                />

        )
    }
}
export default LineChart;