import React, { Component } from 'react';
import './App.css';
import ThermometerChart from './ThermometerChart';
import LineChart from './ForeCastChart';
import { Tab } from "semantic-ui-react";
import Routes from "./Routes";
import { Auth } from "aws-amplify";
import NavigationBar from "./Navigation";





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
                <div><NavigationBar/></div>
        <Routes childProps={childProps}/>
        <h1>Login: {childProps.isAuthenticated.toString()}</h1>
            </div>
        );
    }


}
export default App;
