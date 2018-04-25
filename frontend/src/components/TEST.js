import React, { Component } from "react";
import { API } from "aws-amplify";
import {Auth} from "aws-amplify/lib/index";


export default class TEST extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            content: "Hallo",
            answer: ""
        };
    }

    deleteUser = async event => {
        event.preventDefault();

        let user = await Auth.currentAuthenticatedUser();
        await user.deleteUser(function (err,succ){
            console.log(err + ":"+succ);
            if(succ !== null){
                this.props.history.push("/login");
            }

        });

    }
    handleSubmit = async event => {
        event.preventDefault();

        if (this.state.content.length === 0) {
            alert("No Content!");
            return;
        }

        this.setState({ isLoading: true });

        try {
            let reply = await this.arduinoTest({
                content: this.state.content
            });
            console.log(reply);
            this.setState({answer: JSON.stringify(reply)});
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    };

     arduinoTest(note) {
       /* let myInit = { // OPTIONAL
            headers: {}, // OPTIONAL
            response: true // OPTIONAL (return entire response object instead of response.data)
        }
        return API.get("strawberry","/hello-world",myInit ) */
        return API.post("strawberry", "/getPlantsForUser", {
            headers:{} ,
            body: {}
        });
    }

    render() {
        return (
            <div className="Test">
                <h1>Test</h1>
                <button onClick={this.handleSubmit}>Test API Call</button>
                <p>Answer:</p>
                <p>{this.state.answer}</p>
                <button onClick={this.deleteUser}>!!DELETE THIS USER!!</button>
            </div>
        );
    }
}