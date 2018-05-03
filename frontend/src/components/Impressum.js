import React, { Component } from 'react';
import "./Impressum.css";

export default class Impressum extends Component{
    render(){
        let seite;
        if (window.innerWidth>="900"){
            seite= "seite1"}
        else{
            seite="seite2"}

        let impressumStyle;
        /*this.props.childProps.isAuthenticated*/ /*tut damit leider nicht*/
        if (true){
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
                    <div className="impressum">
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