import React, {Component} from 'react';
import thermometermaske from './../img/thermometermaske.png';
export default class WaterLevel extends Component{
    constructor(props){
        super(props);
        this.state= {
            temp: this.props.current,
            current: 100-(100/36*(this.props.current+5)),
            greenBorderDown: this.props.greenBorderDown,
            greenBorderUp: this.props.greenBorderUp,
            yellowBorderDown: this.props.yellowBorderDown,
            yellowBorderUp: this.props.yellowBorderUp,
        }

    }
    componentWillReceiveProps(nextProps){
        this.setState({
            temp: nextProps.current,
            current: 100-(100/36*(nextProps.current+5)),
            greenBorderDown: nextProps.greenBorderDown,
            greenBorderUp: nextProps.greenBorderUp,
            yellowBorderDown: nextProps.yellowBorderDown,
            yellowBorderUp: nextProps.yellowBorderUp,
        });
    }


    render(){
        return (
            <div style={{backgroundColor:(this.state.current+5 <=this.state.greenBorderDown || this.state.current+5 >=this.state.greenBorderUp)?this.props.barColor:(this.state.current+5 >=this.state.yellowBorderDown || this.state.current+5 <= this.state.yellowBorderUp)?"green":"#EEC900",width:"100%",height:"100%",position:"relative"}}>
                <div style={{zIndex:"1",backgroundColor:"gray",width: "100%", height: this.state.current+"%" ,position:"absolute"}}/>
                <div style={{zIndex:"3",display:"table",width:"100%",height:"30%",bottom: "0px", position:"absolute"}}>
                    <p style={{display: "table-cell",color:"white",fontSize:"10px",textAlign:"center",fontWeight:"bold",verticalAlign:"middle",paddingLeft:"25%",paddingTop:"50%"}}>{this.state.temp+"mm"}</p>
                </div>
                <img src={thermometermaske} style={{zIndex:"2",width:"100%",height:"100%",position:"absolute"}}/>

            </div>


        )
    }
}