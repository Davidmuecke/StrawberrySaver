import React from "react";
import { Switch } from "react-router-dom";
import AppliedRoute from "./containers/AppliedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import PlantDetail from "./components/PlantDetail";
import TEST from "./components/TEST";
import PlantsOverview from "./components/PlantsOverview";
import PlantAdd from "./components/PlantAdd";
import Impressum from "./components/Impressum";
import User from "./components/User";

export default ({ childProps}) =>
    <Switch>
        <AppliedRoute path="/" exact component={PlantsOverview} props={childProps}  />
        <AppliedRoute path="/login" exact component={Login} props={childProps} />
        <AppliedRoute path="/register" exact component={Register} props={childProps} />
        <AppliedRoute path="/test" exact component={TEST} props={childProps} />
        <AppliedRoute path="/impressum" exact component={Impressum} props={childProps} />
        <AppliedRoute path="/plantDetail" exact component={PlantDetail} props={childProps}/>
        <AppliedRoute path="/plantAdd" exact component={PlantAdd} props={childProps}/>
        <AppliedRoute path="/user" exact component={User} props={childProps} />
        { /* Finally, catch all unmatched routes */ }

    </Switch>;