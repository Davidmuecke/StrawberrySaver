import React, { Component} from "react";
import { Button, Form } from 'semantic-ui-react';
import { Auth } from "aws-amplify";
import "./Register.css";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            given_name: "",
            family_name:"",
            newUser: null
        };

        if(this.props.isAuthenticated === true){
            this.props.history.push("/");
        }
    }

    validateForm() {
        return (
            this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.given_name.length >0 &&
            this.state.family_name.length >0 &&
            this.state.password === this.state.confirmPassword
        );
    }


    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            const newUser = await Auth.signUp({
                username: this.state.email,
                password: this.state.password,
                attributes: {
                    given_name: this.state.given_name,
                    family_name: this.state.family_name
                }
            });
            this.setState({
                newUser
            });
        } catch (e) {
            alert(e.message);
        }

        this.setState({ isLoading: false });
    }


    handleConfirmationSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            await Auth.signIn(this.state.email, this.state.password);

            this.props.userHasAuthenticated(true);
            this.props.history.push("/");
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false });
        }
    }

    renderConfirmationForm() {
        var seite;
        if (window.innerWidth>="900"){
            seite= "seite1"}
        else{
            seite="seite2"}
        return (
            <div id={seite}>
                <div className="registration">
                    <h1>Registrierung bestätigen</h1>
                    <Form onSubmit={this.handleConfirmationSubmit}>
                        <Form.Field >
                            <label>Confirmation Code</label>
                            <input
                                autoFocus
                                id="confirmationCode"
                                type="tel"
                                value={this.state.confirmationCode}
                                onChange={this.handleChange}
                                className="registration_box"
                            />
                        </Form.Field>
                        <Button
                            disabled={!this.validateConfirmationForm()}
                            type="submit"
                        >Verify</Button>
                    </Form>
                </div>
            </div>
        );
    }

    renderForm() {
        var seite;
        if (window.innerWidth>="900"){
            seite= "seite1"}
        else{
            seite="seite2"}
        return (
            <div id={seite}>
                <div className="registration">
                    <h1>Registrierung</h1>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field  >
                            <label>Email</label>
                            <input
                                autoFocus
                                id="email"
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                className="registration_box"
                            />
                        </Form.Field>
                        <Form.Field  >
                            <label>Vorname</label>
                            <input
                                id="given_name"
                                type="text"
                                value={this.state.given_name}
                                onChange={this.handleChange}
                                className="registration_box"
                            />
                        </Form.Field>
                        <Form.Field  >
                            <label>Nachname</label>
                            <input
                                id="family_name"
                                type="text"
                                value={this.state.family_name}
                                onChange={this.handleChange}
                                className="registration_box"
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <input
                                id="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                type="password"
                                className="registration_box"
                            />
                        </Form.Field>
                        <Form.Field >
                            <label>Confirm Password</label>
                            <input
                                id="confirmPassword"
                                value={this.state.confirmPassword}
                                onChange={this.handleChange}
                                type="password"
                                className="registration_box"
                            />
                        </Form.Field>
                        <Button
                            disabled={!this.validateForm()}
                            type="submit"
                        >Signup </Button>
                    </Form>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="Signup">
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </div>
        );
    }

}