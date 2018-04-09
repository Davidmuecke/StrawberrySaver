import React, { Component } from 'react';
import './App.css';
import ThermometerChart from './ThermometerChart';
import LineChart from './ForeCastChart';
import { Tab } from "semantic-ui-react";
import Routes from "./Routes";
import { Auth } from "aws-amplify";

//Für die Skala beim Thermometer
var styletype= ["red","red","red","red","red","red","red","red","red","red","red","red",
    "red","red","red","red","red","red","red","red","green","green","green","green",
    "green","green","red","red","red","red","red","red","red","red","red","red"];
const panes = [
    { menuItem: 'Temperatur', render: () => <Tab.Pane><div className="tempchart"> <LineChart type="temp" appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"/> </div></Tab.Pane>},
    { menuItem: 'Regen', render: () => <Tab.Pane><div className="rainchart"><LineChart type="rain" appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"/> </div></Tab.Pane>},
];

class App extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true
        };
    }

    async componentDidMount() {
        try {
            if (await Auth.currentSession()) {
                console.log(Auth.currentSession());
                let user = await Auth.currentAuthenticatedUser();

                let attributes = await  Auth.userAttributes(user);
                console.log(attributes[2].Name);
                console.log(attributes);
                console.log(user);
                this.userHasAuthenticated(true);
            }
        }
        catch(e) {
            console.log("App:ComponentDidMount() "+e);
            /*if (e !== 'No current user') {
                alert(e);
            }*/
        }

        this.setState({ isAuthenticating: false });
    }

    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: authenticated });
    }

    handleLogout = async event => {
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log(err));
        await Auth.signOut();

        this.userHasAuthenticated(false);
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated,
            handleLogout: this.handleLogout
        };
        return (
            !this.state.isAuthenticating &&<div>
        <Routes childProps={childProps}/>
        <h1>Login: {childProps.isAuthenticated.toString()}</h1>
            </div>
        );
    }
        /* From Render Method
        <div className="App">
            <header className="App-header">
            <h1 className="App-title">Strawberry Saver</h1>
            </header>

            <p className="App-intro">
                Save your plants from drying out!
            </p>

        </div>
        <h3>Aktuelle Werte:</h3>
        <div className="Thermometerchart" >
            <ThermometerChart styleType={styletype} appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"/>
        </div>
        <h3>Vorbericht</h3>
        <div className="forecast" >
            <Tab menu={{ fluid: true, vertical: true, tabular: 'right' }} panes={panes} />
        </div>*/


}
export default App;
