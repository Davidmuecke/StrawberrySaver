import React, { Component, Fragment } from "react";


export default class TEST extends Component {
    constructor(props) {
        super(props);
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
            </div>
        );
    }
}