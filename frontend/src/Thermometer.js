import React, {Component} from 'react';
import thermometermaske from './img/thermometermaske.png';
export default class Thermometer extends Component{

    current = 100-(100/36*this.props.current);

    render(){
        return (
            <div style={{backgroundColor:(this.props.current <20 || this.props.current >30)?"red":"green",width:"100%",height:"100%",position:"relative"}}>
                <div style={{zIndex:"1",backgroundColor:"gray",width: "100%",height:this.current+"%",position:"absolute"}}/>
            <img src={thermometermaske} style={{zIndex:"2",width:"100%",height:"100%",position:"absolute"}}/>

            </div>
        )
    }
}