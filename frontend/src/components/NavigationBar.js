import React, { Component } from 'react';
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./NavigationBar.css";


export default class NavigationBar extends  Component{
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
            default:
                this.state={ activeItem:"impressum"};
        }

    }


    handleItemClick = (e, { name }) =>{
        this.setState({ activeItem: name});
        if(name === "logout"){
            console.log(this.props.childProps.isAuthenticated);
            this.props.childProps.handleLogout();
        }
    };

    render(){

        const { activeItem } = this.state;
        return (
            <div>
                {this.props.childProps.isAuthenticated ?
                    <Menu vertical style={{float:"left"}}>
                        <Menu.Item>
                            <div id="menu_header">
                            <Menu.Header as={Menu.Item}><text class="font_menu">StrawBerrySaver</text></Menu.Header>
                            </div>
                                <Menu.Item as={Link} to="/" name='uebersicht' active={activeItem === 'uebersicht'} onClick={this.handleItemClick}>
                                    <text class="font_menu">Pflanzen</text>
                                    {activeItem==="uebersicht"?
                                    <Menu.Menu>
                                        <Menu.Item as={Link} to={"/plantDetail?name="+0} name={this.props.childProps.names[0]} active={activeItem === this.props.childProps.names[0]} onClick={this.handleItemClick}/>
                                        <Menu.Item as={Link} to={"/plantDetail?name="+1} name={this.props.childProps.names[1]} active={activeItem === this.props.childProps.names[1]} onClick={this.handleItemClick}/>
                                        <Menu.Item as={Link} to={"/plantDetail?name="+2} name={this.props.childProps.names[2]} active={activeItem === this.props.childProps.names[2]} onClick={this.handleItemClick}/>
                                    </Menu.Menu>
                                        :<div/> }
                                </Menu.Item>
                            <Menu.Item as={Link} to="/test" name='test' active={activeItem === 'test'} onClick={this.handleItemClick}>
                                <text class="font_menu">Test</text>
                            </Menu.Item>
                            <Menu.Item as={Link} to="/user" name='user' active={activeItem === 'user'} onClick={this.handleItemClick}>
                                <text class="font_menu">Nutzer</text>
                            </Menu.Item>
                            <Menu.Item as={Link} to="/impressum" name='impressum' active={activeItem === 'impressum'} onClick={this.handleItemClick}>
                                <text class="font_menu">Impressum</text>
                            </Menu.Item>
                            <Menu.Item name='logout' active={activeItem ==='logout'} onClick={this.handleItemClick}>
                                <text class="font_menu">Logout</text>
                            </Menu.Item>

                        </Menu.Item>
                    </Menu>
                : <Menu vertical style={{float:"left"}}>
                        <Menu.Item as={Link} to="/login" name='login' active={activeItem === 'login'} onClick={this.handleItemClick}>
                            <text class="font_menu">Login</text>
                        </Menu.Item>
                        <Menu.Item as={Link} to="/register" name='register' active={activeItem === 'register'} onClick={this.handleItemClick}>
                            <text class="font_menu">Registrieren</text>
                        </Menu.Item>
                        <Menu.Item as={Link} to="/impressum" name='impressum' active={activeItem === 'impressum'} onClick={this.handleItemClick}>
                            <text class="font_menu">Impressum</text>
                        </Menu.Item>
                    </Menu>
                }
            </div>
        )
    }
}