import React, { Component} from 'react';
import './App.css';
import Routes from "./Routes";
import {withRouter } from "react-router-dom";
import { Auth } from "aws-amplify";
import NavigationBar from "./components/NavigationBar";





class App extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            names:""
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
    };

    handleLogout = async () => {
        console.log("loggg");
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log(err));
        await Auth.signOut();
        this.userHasAuthenticated(false);
        this.props.history.push("/login");
    };
     getNames= (plantNames)=>{
             this.setState({names:plantNames});
    };
    render() {


        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated,
            handleLogout: this.handleLogout,
            callback: this.getNames,
            names:this.state.names,
            pathname:this.props.location.pathname
        };

        return (
            <div>
                {!this.state.isAuthenticating&&
                <div>
                    <div><NavigationBar childProps={childProps} /></div>
                    <Routes childProps={childProps}/>
                </div>
                }
            </div>
        );
    }


}
export default withRouter(App);
