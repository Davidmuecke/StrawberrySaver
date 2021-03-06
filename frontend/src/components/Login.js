import React, {Component} from "react";
import "./Login.css";
import {Button, Form, Grid} from 'semantic-ui-react'
import {Auth} from "aws-amplify";
import {API} from "aws-amplify/lib/index";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
        if (this.props.isAuthenticated === true) {
            this.props.history.push("/");
        }
    }

    integrateUser() {
        /* let myInit = { // OPTIONAL
             headers: {}, // OPTIONAL
             response: true // OPTIONAL (return entire response object instead of response.data)
         }
         return API.get("strawberry","/hello-world",myInit ) */
        return API.post("strawberry", "/checkUserData", {
            headers: {},
            body: {}
        });
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = async event => {
        event.preventDefault();

        try {
            await Auth.signIn(this.state.email, this.state.password).then(() => console.log());
            //console.log(Auth.currentSession());
            this.props.userHasAuthenticated(true);
            await this.integrateUser();
            this.props.renewGlobalPlantData();
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
        }
    };

    render() {
        let page;
        if (window.innerWidth >= "900") {
            page = "seite2"
        }
        else {
            page = "seite2"
        }
        return (
            <div id={page}>
                <div className="login">
                    <Grid>
                        <Grid.Column>
                            <Grid.Row>
                                <h1>Anmeldung</h1>
                            </Grid.Row>
                            <Grid.Row>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Field>
                                        <label>Email</label>
                                        <input
                                            id={"email"}
                                            autoFocus
                                            type={"email"}
                                            value={this.state.email}
                                            onChange={this.handleChange}
                                            autoComplete={"email"}
                                            className="login_box"
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Password</label>
                                        <input
                                            id={"password"}
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                            autoComplete={"password"}
                                            type={"password"}
                                            className="login_box"
                                        />
                                    </Form.Field>
                                    <Button
                                        disabled={!this.validateForm()}
                                        type="submit"
                                    >
                                        Login
                                    </Button>
                                </Form>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                </div>
            </div>
        );
    }
}