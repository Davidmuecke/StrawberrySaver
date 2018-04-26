import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import {Auth} from "aws-amplify/lib/index";
import "./style_test.css";

export default class User extends Component {
    constructor(props){
        super(props);
        this.State = {
            given_name:"",
            family_name:"",
            email:"",
            user:""
        }


    }


    async componentDidMount(){
        this.setState({
            given_name: "Hallo"
        });
        let user = await Auth.currentAuthenticatedUser();
        let attributes = await  Auth.userAttributes(user);
        let givenName,familyName,mail;
        for(let i=0; i<attributes.length;i++){
           switch(attributes[i].Name){
               case "given_name":
                   givenName= attributes[i].Value;
                   break;
               case "family_name":
                   familyName= attributes[i].Value;
                   break;
               case "email":
                   mail = attributes[i].Value;
                   break;
               default:
               /*nothing*/
           }
        }
        this.setState({
            given_name: "Hallo",
            family_name: familyName,
            email: mail
        }, function () {
            console.log(givenName+" "+familyName+" "+ mail);
            console.log(this.State);
        });


        return null;
    }

    /**
     * Handle delete user requests
     */
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

    render(){
        var seite;
        if (window.innerWidth>="900"){
            seite= "seite1"}
        else{
            seite="seite2"}
        return (
            <div>
                <div id={seite}>
                    <p>Vorname: {this.State.given_name}</p>
                    <Button onClick={this.deleteUser}>!!DELETE THIS USER!!</Button>
                </div>
            </div>
        );
    }
}