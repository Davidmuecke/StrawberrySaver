import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ThermometerChart from './ThermometerChart';
import LineChart from './ForeCastChart';
//Für die Skala beim Thermometer
var styletype= ["red","red","red","red","red","red","red","red","red","red","red","red",
    "red","red","red","red","red","red","red","red","green","green","green","green",
    "green","green","red","red","red","red","red","red","red","red","red","red"];
class App extends Component {
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
    <h3>Aktuelle Werte:</h3>
    <div className="ActualValue" >
        <ThermometerChart styleType={styletype} appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"/>
    </div>
    <h3>Vorbericht</h3>
    <div className="forecast" >
        <LineChart appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"/>
    </div>
</div>

    );
    }
}
export default App;
