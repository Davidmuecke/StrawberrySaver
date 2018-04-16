import React, { Component } from 'react';
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";


export default class NavigationBar extends  Component{
    constructor(props) {
        super(props);
        this.state = { activeItem: 'uebersicht' };
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
                    <Menu pointing>
                        <Menu.Item as={Link} to="/" name='uebersicht' active={activeItem === 'uebersicht'} onClick={this.handleItemClick} />
                        <Menu.Item as={Link} to="/test" name='test' active={activeItem === 'test'} onClick={this.handleItemClick} />
                        <Menu.Item as={Link} to="/impressum" name='impressum' active={activeItem === 'impressum'} onClick={this.handleItemClick} />
                        <Menu.Menu position='right'>
                            <Menu.Item name='logout' active={activeItem ==='logout'} onClick={this.handleItemClick}/>
                        </Menu.Menu>
                    </Menu>
                : <Menu pointing>
                        <Menu.Item as={Link} to="/login" name='login' active={activeItem === 'login'} onClick={this.handleItemClick} />
                        <Menu.Item as={Link} to="/register" name='register' active={activeItem === 'register'} onClick={this.handleItemClick} />
                        <Menu.Item as={Link} to="/impressum" name='impressum' active={activeItem === 'impressum'} onClick={this.handleItemClick} />
                    </Menu>
                }
            </div>
        )
    }
}