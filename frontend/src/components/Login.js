import React, { Component } from "react";
import "./Login.css";
import { Button, Form } from 'semantic-ui-react'
import { Auth } from "aws-amplify";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
        if(this.props.isAuthenticated === true){
            this.props.history.push("/");
        }
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        try {
            await Auth.signIn(this.state.email, this.state.password).then(x => console.log(x));
            console.log(Auth.currentSession());
            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
        }
    }

    render() {
        return (
            <div className="login">
                <h1>Anmeldung</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field >
                        <label>Email</label>
                        <input
                            id={"email"}
                            autoFocus
                            type={"email"}
                            value={this.state.email}
                            onChange={this.handleChange}
                            className="login_box"
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Password</label>
                        <input
                            id={"password"}
                            value={this.state.password}
                            onChange={this.handleChange}
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
            </div>
        );
    }
}