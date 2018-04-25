import React, { Component } from 'react';
import "./Impressum.css";
import "./style_test.css";

export default class Impressum extends Component{
    render(){
        return (
            <div>
                <div  id="seite">
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