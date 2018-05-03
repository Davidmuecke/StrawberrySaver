import React, { Component } from 'react';
import "./Impressum.css";

export default class Impressum extends Component{
    constructor(props) {
        super(props);
    }

    render(){
        let seite;
        if (window.innerWidth>="900"){
            seite= "seite1"}
        else{
            seite="seite2"}

        let impressumStyle;

        if (this.props.isAuthenticated){
            if(window.innerWidth<="900"){
                impressumStyle = "center";
            }
            else {
                impressumStyle = "none";
            }
        }
        else{
            impressumStyle="center";
        }

        return (
            <div id={seite}>
                <div style={{textAlign:impressumStyle}}>
                    <div>
                        <h1> Impressum </h1>
                        <h3 id="impressum_name">Strawberry Saver</h3>
                        <text>Web Engineering Projekt<br/></text>
                        <text>TINF16B Enrico Keil 4.Semester<br/></text>
                        <text>Copyright by David, Niklas, Jonathan und Rahel<br/></text>
                    </div>
                </div>
            </div>

        )
    }

}