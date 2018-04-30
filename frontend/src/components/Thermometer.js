import React, {Component} from 'react';
import thermometermaske from './../img/thermometermaske.png';
export default class Thermometer extends Component{
constructor(props){
    super(props);
    this.state= {
        temp: this.props.current
    }

}
    current = 100-(100/36*(this.props.current+5));

    render(){
        return (
            <div style={{backgroundColor:(this.props.current+5 <=this.props.greenBorderDown || this.props.current+5 >=this.props.greenBorderUp)?"red":(this.props.current+5 >=this.props.yellowBorderDown || this.props.current+5 <= this.props.yellowBorderUp)?"green":"#EEC900",width:"100%",height:"100%",position:"relative"}}>
                <div style={{zIndex:"1",backgroundColor:"gray",width: "100%",height:this.current+"%",position:"absolute"}}/>
                <div style={{zIndex:"3",display:"table",width:"100%",height:"30%",bottom: "0px", position:"absolute"}}>
                    <p style={{display: "table-cell",color:"white",fontSize:"20px",textAlign:"center",fontWeight:"bold",verticalAlign:"middle",paddingLeft:"25%",paddingTop:"50%"}}>{this.props.current+"°C"}</p>
                </div>
            <img src={thermometermaske} style={{zIndex:"2",width:"100%",height:"100%",position:"absolute"}}/>

            </div>
        )
    }
}