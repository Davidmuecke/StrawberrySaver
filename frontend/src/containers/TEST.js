import React, { Component, Fragment } from "react";
import { API, Auth } from "aws-amplify";
import config from "../config";

export default class TEST extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            content: "Hallo"
        };
    }
    handleSubmit = async event => {
        event.preventDefault();

        if (this.state.content.length == 0) {
            alert("Please pick a file smaller than 5MB");
            return;
        }

        this.setState({ isLoading: true });

        try {
            var x = await Auth.currentAuthenticatedUser();
            var reply = await this.createNote({
                content: this.state.content,
                user: x
            });
            console.log(reply);
           // this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    createNote(note) {
        return API.post("strawberry", "/arduinoTest", {
            body: note
        });
    }

    render() {
        return (
            <div className="Test">
                <h1>Test</h1>
                {this.props.isAuthenticated
                    ? <button onClick={this.props.handleLogout}>Logout</button>
                    : <Fragment>
                        <div to="/signup">
                            <button>Signup</button>
                        </div>
                        <div to="/login">
                            <button>Login</button>
                        </div>
                    </Fragment>
                }
                <button onClick={this.handleSubmit}>Test</button>
            </div>
        );
    }
}