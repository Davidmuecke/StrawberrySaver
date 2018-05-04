import React, { Component } from 'react';
import "./style_menu_and_seite.css";

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
                        <h3 style={{paddingTop: "20px"}}>Strawberry Saver</h3>
                        <text>Web Engineering Projekt<br/></text>
                        <text>TINF16B Enrico Keil 4.Semester<br/></text>
                        <text>Copyright by David Koch, Niklas Jäger, Jonathan Weyl und Rahel Illi<br/></text>
                    </div>
                </div>
            </div>

        )
    }

}