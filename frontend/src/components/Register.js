import React, { Component} from "react";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        if(this.props.isAuthenticated === true){
            this.props.history.push("/");
        }
    }
    render(){
        return <div>
            <h1>Registrierung</h1>
        </div>;
    }

}