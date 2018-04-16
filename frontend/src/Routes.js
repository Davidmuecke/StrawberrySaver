import React from "react";
import { Switch } from "react-router-dom";
import AppliedRoute from "./containers/AppliedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import TEST from "./components/TEST";

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={TEST} props={childProps} />
        <AppliedRoute path="/login" exact component={Login} props={childProps} />
        <AppliedRoute path="/register" exact component={Register} props={childProps} />
        { /* Finally, catch all unmatched routes */ }

    </Switch>;