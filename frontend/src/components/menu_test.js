import React, { Component } from 'react';
import "./NavigationBar.css";
import "./style_menu_and_seite.css";
import {Link} from "react-router-dom";


export default class MenuLeft extends  Component{
    constructor(props) {
        super(props);

        switch(this.props.childProps.pathname){
            case "/plantDetail":
                this.state = { activeItem: this.props.childProps.names[0] };
                break;
            case "/":
                this.state = { activeItem: "uebersicht" };
                break;
            case "/test":
                this.state = { activeItem:"test"};
                break;
            case "/impressum":
                this.state={ activeItem:"impressum"};
                break;
            case "/login":
                this.state={ activeItem:"login"};
                break;
            case "/user":
                this.state={ activeItem:"user"};
                break;
            default:
                this.state={ activeItem:"impressum"};
        }

    }


    handleItemClick = ({ name }) =>{
        this.setState({ activeItem: name});
        if(name === "logout"){
            console.log(this.props.childProps.isAuthenticated);
            this.props.childProps.handleLogout();
        }
    };

    render(){
        var rows=[];
        for(let i=0;i<this.props.childProps.plants.length;i++)
        {
            rows.push(<li><a href={"/plantDetail?name="+i} name={this.props.childProps.names[i][0]} active={activeItem === this.props.childProps.names[i][0]} onClick={this.handleItemClick}><text><script type="text/javascript">this.props.childProps.names[i][0]</script></text></a></li>
            )
        }
        const { activeItem } = this.state;
        return (
            <div>
                {this.props.childProps.isAuthenticated ?
                    <div>
                        <div className="topnav" id="myTopnav">
                            <ul>
                                <li>
                                    <a className="icon" onClick={function responsiveMenu2() {
                                        var x = document.getElementById("myLeftnav");
                                        if (x.style.display === "none") {
                                            x.style.display = "block";
                                        }
                                        else{
                                            x.style.display="none";
                                        }
                                        if (x.className === "leftnav") {
                                            x.className = "leftnav responsive";
                                        } else {
                                            x.className = "leftnav";
                                        }

                                    }}>&#9776;</a>
                                    <a id="menuheader_top" className="menuheader_top">Strawberry Saver</a>
                                </li>
                            </ul>
                        </div>

                        <div className="leftnav" id="myLeftnav">
                            <ul>
                                <li>
                                    <a className="menuheader">Strawberry Saver</a>
                                </li>
                                <li>
                                    <a href="/" name='uebersicht' active={activeItem === 'uebersicht'} onClick={this.handleItemClick}>Pflanze</a>
                                    {activeItem==="uebersicht"?
                                        <div>
                                            {activeItem==="uebersicht"?
                                                <div>
                                                    {rows}
                                                </div>
                                                :<div/>}
                                        </div>
                                        : <div/> }
                                </li>
                                <li>
                                    <a href="/test" name='test' active={activeItem === 'test'} onClick={this.handleItemClick}>Test</a>
                                </li>
                                <li>
                                    <a href="/user" name='user' active={activeItem === 'user'} onClick={this.handleItemClick}>Nutzer Name</a>
                                </li>
                                <li>
                                    <a href="/impressum" name='impressum' active={activeItem === 'impressum'} onClick={this.handleItemClick}>Impressung</a>
                                </li>
                                <li>
                                    <a name='logout' active={activeItem ==='logout'} onClick={() => this.handleItemClick({name:"logout"})}>Logout</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    :<div>
                        <div className="topnav" id="myTopnav">
                            <ul>
                                <li>
                                    <a className="icon" onClick={function responsiveMenu2() {
                                        var x = document.getElementById("myLeftnav");
                                        if (x.style.display === "none") {
                                            x.style.display = "block";
                                        }
                                        else{
                                            x.style.display="none";
                                        }
                                        if (x.className === "leftnav") {
                                            x.className = "leftnav responsive";
                                        } else {
                                            x.className = "leftnav";
                                        }

                                    }}>&#9776;</a>
                                    <a id="menuheader_top" className="menuheader_top">Strawberry Saver</a>
                                </li>
                            </ul>
                        </div>
                        <div className="leftnav" id="myLeftnav">
                            <ul>
                                <li>
                                    <a className="menuheader">Strawberry Saver</a>
                                </li>
                                <li>
                                    <a href="/login" name='login' active={activeItem === 'login'} onClick={this.handleItemClick}>Login</a>
                                </li>
                                <li>
                                    <a href="/register" name='register' active={activeItem === 'register'} onClick={this.handleItemClick}>Registrierung</a>
                                </li>
                                <li>
                                    <a href="/impressum" name='impressum' active={activeItem === 'impressum'} onClick={this.handleItemClick}>Impressung</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
