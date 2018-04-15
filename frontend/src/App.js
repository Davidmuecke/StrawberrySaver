import React, { Component, Fragment } from 'react';
import './App.css';
import Routes from "./Routes";
import {withRouter, Link } from "react-router-dom";
import { Auth } from "aws-amplify";

/*Für die Skala beim Thermometer
var styletype= ["red","red","red","red","red","red","red","red","red","red","red","red",
    "red","red","red","red","red","red","red","red","green","green","green","green",
    "green","green","red","red","red","red","red","red","red","red","red","red"];
const panes = [
    { menuItem: 'Temperatur', render: () => <Tab.Pane><div className="tempchart"> <LineChart type="temp" appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"/> </div></Tab.Pane>},
    { menuItem: 'Regen', render: () => <Tab.Pane><div className="rainchart"><LineChart type="rain" appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"/> </div></Tab.Pane>},
];
*/
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
            if(this.props.location.pathname !== "/register") {
                this.props.history.push("/login");
            }
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
        this.props.history.push("/login");
    }

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated,
            handleLogout: this.handleLogout
        };
        return (
            <div>
                {!this.state.isAuthenticating&&
                <div>
                    <h1>Menüleiste</h1>
                    {this.state.isAuthenticated
                        ? <button onClick={childProps.handleLogout}>Logout</button>
                        : <Fragment>
                            <Link to="/register">
                                <button>Register</button>
                            </Link>
                            <Link to="/login">
                                <button>Login</button>
                            </Link>
                        </Fragment>
                    }
                    <Routes childProps={childProps}/>
                </div>
                }
            </div>
        );
    }


}
export default withRouter(App);
/*
<Redirect to={{pathname: "/login"}}/>
 */