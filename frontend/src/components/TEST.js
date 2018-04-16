import React, { Component } from "react";
import { API } from "aws-amplify";


export default class TEST extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            content: "Hallo",
            answer: ""
        };
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

    static arduinoTest(note) {
       /* let myInit = { // OPTIONAL
            headers: {}, // OPTIONAL
            response: true // OPTIONAL (return entire response object instead of response.data)
        }
        return API.get("strawberry","/hello-world",myInit ) */
        return API.post("strawberry", "/arduinoTest", {
            headers:{} ,
            body: {userID: "1", note: note}
        });
    }

    render() {
        return (
            <div className="Test">
                <h1>Test</h1>
                <button onClick={this.handleSubmit}>Test API Call</button>
                <p>Answer:</p>
                <p>{this.state.answer}</p>
            </div>
        );
    }
}