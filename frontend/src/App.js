import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ThermometerChart from './ThermometerChart';
import ForecastMenu from "./ForecastMenu";
import NavigationBar from "./Navigation";





class App extends Component{

    render() {
        return (
    <div>
        <div><NavigationBar/></div>
    </div>
    );
    }
}
export default App;
