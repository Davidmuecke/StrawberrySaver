import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ThermometerChart from './ThermometerChart';
import ForecastMenu from "./ForecastMenu";





class App extends Component{

    render() {
        return (
    <div>
        <div className="App">
            <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Strawberry Saver</h1>
            </header>

            <p className="App-intro">
                Save your plants from drying out!
            </p>
        </div>

        <ThermometerChart appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"/>
        <ForecastMenu/>
    </div>
    );
    }
}
export default App;
