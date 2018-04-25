import React, {Component} from 'react';
import thermometermaske from './../img/thermometermaske.png';
export default class Thermometer extends Component{

    current = 100-(100/36*(this.props.current+5));

    render(){
        return (
            <div style={{backgroundColor:(this.props.current <20 || this.props.current >30)?"red":"green",width:"100%",height:"100%",position:"relative"}}>
                <div style={{zIndex:"1",backgroundColor:"gray",width: "100%",height:this.current+"%",position:"absolute"}}/>
                <div style={{zIndex:"3",display:"table",width:"100%",height:"30%",bottom: "0px", position:"absolute"}}>
                    <p style={{display: "table-cell",color:"white",fontSize:"20px",textAlign:"center",fontWeight:"bold",verticalAlign:"middle",paddingLeft:"25%",paddingTop:"50%"}}>{this.props.current+"°C"}</p>
                </div>
            <img src={thermometermaske} style={{zIndex:"2",width:"100%",height:"100%",position:"absolute"}}/>

            </div>
        )
    }
}