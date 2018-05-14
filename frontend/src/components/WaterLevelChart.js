import React, {Component} from 'react';
import WaterLevel from "./WaterLevel";


export default class WaterLevelChart extends Component {
    constructor(props){
        super(props);
        this.styleTypeReset();
        let perfectWater= Math.round(Number(this.props.water)/93.09);
        let greenScopeArray= Math.floor(Number(this.props.scopeGreen)/93.09);
        let yellowScopeArray =Math.floor(Number(this.props.scopeYellow)/93.09);
        this.styleType[perfectWater-1]="green";
        for(let i=1; i<=greenScopeArray;i++){
            this.styleType[perfectWater+i-1]= "green";
            this.styleType[perfectWater -i-1]="green";

        }
        for(let j=1;j<=yellowScopeArray;j++){
            this.styleType[perfectWater+(greenScopeArray +j)-1]= "#EEC900";
            this.styleType[perfectWater-greenScopeArray -j-1]="#EEC900";
        }
        this.state={water:this.props.water,perfectTemp:perfectWater,greenScopeArray:greenScopeArray,yellowScopeArray:yellowScopeArray,liveWater:this.props.liveWater,scopeGreen:this.props.scopeGreen,scopeYellow:this.props.scopeYellow};

    }
//aktuelle Temperatur, die -268,15 entstehen aus der Umrechnung von Kelvin in Celsius sowie die Transformation in das Thermometer(Das geht intern von 0 bis 35
    // current=  getURL("http://api.openweathermap.org/data/2.5/weather?id="+this.props.cityID+"&appid="+this.props.appid)['main']['temp']-273.15;
    styleType= ["blue","blue","blue","blue","blue",
        "blue","blue","blue","blue","blue",
        "blue"];
    styleTypeReset(){
        this.styleType= ["blue","blue","blue","blue","blue",
            "blue","blue","blue","blue","blue",
            "blue"];
    }
    componentWillReceiveProps(nextProps){
        this.styleTypeReset();
        let perfectWater= Math.round(Number(nextProps.water)/93.09 );
        let greenScopeArray= Math.floor(Number(nextProps.scopeGreen)/93.09 );
        let yellowScopeArray =Math.floor(Number(nextProps.scopeYellow)/93.09 );
        this.styleType[perfectWater-1]="green";

        for(let i=1; i<=greenScopeArray;i++){
            this.styleType[perfectWater+i-1]= "green";
            this.styleType[perfectWater -i-1]="green";

        }
        for(let j=1;j<=yellowScopeArray;j++){
            this.styleType[perfectWater +(greenScopeArray+j)-1]= "#EEC900";
            this.styleType[perfectWater -greenScopeArray-j-1]="#EEC900";
        }
        this.setState({water:nextProps.water,perfectWater:perfectWater,greenScopeArray:greenScopeArray,yellowScopeArray:yellowScopeArray,liveWater:nextProps.liveWater,scopeGreen:nextProps.scopeGreen,scopeYellow:nextProps.scopeYellow});
    }
    render(){
        return (
            <div className="Thermometerchart" >
                <h2>Wasserstand Pflanze</h2>

                <div style={{float:"left",width:"100px",height:"305px"}}>
                    <WaterLevel current={parseInt(this.state.liveWater,10)} greenBorderUp={parseInt(this.state.water,10)+parseInt(this.state.scopeGreen,10)} greenBorderDown={parseInt(this.state.water,10)-this.state.scopeGreen}
                                yellowBorderUp={parseInt(this.state.water,10)+parseInt(this.state.scopeGreen,10) + parseInt(this.state.scopeYellow,10)} yellowBorderDown={parseInt(this.state.water,10)-this.state.scopeGreen - this.state.scopeYellow} barColor={this.props.barColor}/>
                </div>
                <div style={{height:"305px"}}>
                    <ul style={{padding:"0px,0px,0px,0px",margin:"0px,0px,0px,0px",listStyle:"none",height:"100%"}}>
                        <li style={{color:this.styleType[10],height:"9.5%", fontSize:"15px"}}>100%</li>
                        <li style={{color:this.styleType[9], height:"9.5%",fontSize:"15px",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[8], height:"9.5%",fontSize:"15px"}}>80%</li>
                        <li style={{color:this.styleType[7], height:"9.5%",fontSize:"15px",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[6], height:"9.5%",fontSize:"15px"}}>60%</li>
                        <li style={{color:this.styleType[5], height:"9.5%",fontSize:"15px",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[4], height:"9.5%",fontSize:"15px"}}>40%</li>
                        <li style={{color:this.styleType[3], height:"9.5%",fontSize:"15px",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[2], height:"9.5%",fontSize:"15px"}}>20%</li>
                        <li style={{color:this.styleType[1], height:"9.5%",fontSize:"15px",fontWeight:"bold"}}>⋅</li>
                        <li style={{color:this.styleType[0], height:"9.5%",fontSize:"15px"}}>0%</li>
                    </ul>
                </div>
            </div>
        )
    }
}
