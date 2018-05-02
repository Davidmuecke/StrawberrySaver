import React, {Component} from 'react';
import thermometermaske from './../img/thermometermaske.png';
export default class WaterLevel extends Component{
    constructor(props){
        super(props);
        this.state= {
            water: this.props.current,
            current: 100-(this.props.current/10.24),
            greenBorderDown: this.props.greenBorderDown,
            greenBorderUp: this.props.greenBorderUp,
            yellowBorderDown: this.props.yellowBorderDown,
            yellowBorderUp: this.props.yellowBorderUp,
        }

    }
    componentWillReceiveProps(nextProps){
        this.setState({
            water: nextProps.current,
            current: 100-(nextProps.current/10.24),
            greenBorderDown: nextProps.greenBorderDown,
            greenBorderUp: nextProps.greenBorderUp,
            yellowBorderDown: nextProps.yellowBorderDown,
            yellowBorderUp: nextProps.yellowBorderUp,
        });
    }


    render(){
        return (
            <div style={{backgroundColor:(this.state.water <this.state.yellowBorderDown || this.state.water >this.state.yellowBorderUp)?this.props.barColor:(this.state.water >=this.state.greenBorderDown && this.state.water <= this.state.greenBorderUp)?"green":"#EEC900",width:"100%",height:"100%",position:"relative"}}>
                <div style={{zIndex:"1",backgroundColor:"gray",width: "100%", height: this.state.current+"%" ,position:"absolute"}}/>
                <div style={{zIndex:"3",display:"table",width:"100%",height:"30%",bottom: "0px", position:"absolute"}}>
                    <p style={{display: "table-cell",color:"white",fontSize:"10px",textAlign:"center",fontWeight:"bold",verticalAlign:"middle",paddingLeft:"25%",paddingTop:"50%"}}>{Math.round((100-this.state.current)*100)/100+"%"}</p>
                </div>
                <img src={thermometermaske} style={{zIndex:"2",width:"100%",height:"100%",position:"absolute"}}/>

            </div>


        )
    }
}