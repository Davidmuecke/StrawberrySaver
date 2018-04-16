import React, { Component } from 'react';
import { Menu,Segment } from "semantic-ui-react";
import Uebersicht  from "./Uebersicht"
import Impressum from "./Impressum"

export default class NavigationBar extends  Component{
    state = { activeItem: 'uebersicht' };

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });
    render(){
        const { activeItem } = this.state;
        return (
            <div>
            <Menu pointing>
                <Menu.Item name='uebersicht' active={activeItem === 'uebersicht'} onClick={this.handleItemClick} />
                <Menu.Item name='impressum' active={activeItem === 'impressum'} onClick={this.handleItemClick} />
                <Menu.Menu position='right'>
                    <Menu.Item name='logout' active={activeItem ==='logout'} onClick={this.handleItemClick}/>
                </Menu.Menu>
            </Menu>
            <Segment>
                {this.state.activeItem === "uebersicht" ? (
                    <Uebersicht />
                ) : null}
                {this.state.activeItem === "impressum" ? (
                    <Impressum />
                ) : null}
            </Segment>
            </div>
        )
    }
}