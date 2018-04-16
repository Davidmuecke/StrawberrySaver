import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./containers/AppliedRoute";
import Login from "./containers/Login";
import TEST from "./containers/TEST";

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute path="/" exact component={TEST} props={childProps} />
        <AppliedRoute path="/login" exact component={Login} props={childProps} />
        { /* Finally, catch all unmatched routes */ }

    </Switch>;