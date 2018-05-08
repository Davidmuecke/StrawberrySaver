import React, { Component } from 'react';
import "./style_menu_and_seite.css";

export default class Impressum extends Component{

    render(){
        let page;
        if (window.innerWidth>="900"){
            page= "seite1"}
        else{
            page="seite2"}

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
            <div id={page}>
                <div style={{textAlign:impressumStyle}}>
                    <div>
                        <h1> Impressum </h1>
                        <h3 style={{paddingTop: "20px"}}>Strawberry Saver</h3>
                        <p>Web Engineering Projekt<br/>
                        TINF16B Enrico Keil 4.Semester<br/>
                        Copyright by David Koch, Niklas Jäger, Jonathan Weyl und Rahel Illi<br/></p>
                    </div>
                </div>
            </div>

        )
    }

}