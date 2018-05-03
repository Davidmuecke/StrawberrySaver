import React, { Component } from 'react';
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./style_menu_and_seite.css";
import CircularProgressbar from 'react-circular-progressbar';

export default class NavigationBar extends  Component{
    constructor(props) {
        super(props);
        window.addEventListener('resize', function () {
            let x = document.getElementById("myLeftnav");
            if(window.innerWidth >899) {
                x.style.display = "block";
            }
        }, true);
        this.state={activeItem:"",timeToRefresh:20, timePassed:0};
        this.interval = setInterval(this.tick, 1000);
    }
    tick=()=> {
        if(this.state.timePassed===this.state.timeToRefresh-1){
            this.setState({timePassed:0});
            this.props.childProps.renewGlobalPlantData();
        }
        else this.setState({timePassed: this.state.timePassed + 1});
    };
    getParameterByName(name) {
        let url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    componentWillReceiveProps(nextProps){

            switch(nextProps.childProps.pathname){

                case "/plantDetail":

                    this.setState({ activeItem: "uebersicht" });

                    break;
                case "/":
                    this.setState({activeItem: "uebersicht"});
                    break;
                case "/test":
                    this.setState({activeItem: "test"});
                    break;
                case "/impressum":
                    this.setState({activeItem: "impressum"});
                    break;
                case "/plantAdd":
                    this.setState({activeItem:"pflanze_anlegen"});
                    break;
                case "/sensorAdd":
                    this.setState({activeItem:"sensor_anlegen"});
                    break;
                case "/login":
                    this.setState({ activeItem:"login"});
                    break;

                case "/register":
                    this.setState({ activeItem:"register"});
                    break;
                default:
                    this.setState({ activeItem:"impressum"});
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
        let rows=[];
        for(let i=0;i<this.props.childProps.plants.length;i++)
        {
            rows.push(<Menu.Item as={Link} to={"/plantDetail?name="+i} name={this.props.childProps.plants[i][0]} active={activeItem === this.props.childProps.plants[i][0]} onClick={this.handleItemClick}/>);
        }
        const { activeItem } = this.state;
        return (
            <div>
                {this.props.childProps.isAuthenticated ?
                    <div>
                        <div className="topnav" id="myTopnav">
                            <Menu horizontal>
                                    <Menu.Header as={Menu.Item} id="menuheader_top" className="menuheader_top">
                                        <p>StrawBerrySaver</p>
                                    </Menu.Header>
                                    <Menu.Item>
                                    <Menu.Item className="icon" onClick={function responsiveMenu2() {
                                        let x = document.getElementById("myLeftnav");
                                        if (x.style.display === "block") {
                                            x.style.display = "none";
                                        }
                                        else{
                                            x.style.display="block";
                                        }
                                    }}>
                                        <p>&#9776;</p>
                                    </Menu.Item>
                                </Menu.Item>
                            </Menu>
                        </div>

                    <div  className="leftnav" id="myLeftnav">
                        <Menu vertical style={{float:"left"}}>
                            <Menu.Item>
                                <Menu.Header as={Menu.Item} className="menuheader">
                                    <p>StrawBerrySaver</p>
                                </Menu.Header>
                                <Menu.Item as={Link} to="/" name='uebersicht' active={activeItem === 'uebersicht'} onClick={this.handleItemClick}>
                                    <strong>Pflanzen</strong>
                                    {activeItem==="uebersicht"?
                                            <Menu.Menu >
                                                {rows}
                                            </Menu.Menu>
                                    :<div/> }
                                </Menu.Item>
                                <Menu.Item as={Link} to="/test" name='test' active={activeItem === 'test'} onClick={this.handleItemClick}>
                                    <p>Test</p>
                                </Menu.Item>
                                <Menu.Item as={Link} to="/user" name='user' active={activeItem === 'user'} onClick={this.handleItemClick}>
                                    <p>Nutzer</p>
                                </Menu.Item>
                                <Menu.Item name="Anlegen">
                                    <p>Anlegen</p>
                                    <Menu.Menu>
                                        <Menu.Item as={Link} to="/plantAdd" name='pflanze_anlegen' active={activeItem === 'pflanze_anlegen'} onClick={this.handleItemClick}>
                                            <p>Pflanze hinzufügen</p>
                                        </Menu.Item>
                                        <Menu.Item as={Link} to="/sensorAdd" name='sensor_anlegen' active={activeItem === 'sensor_anlegen'} onClick={this.handleItemClick}>
                                            <p>Sensor hinzufügen</p>
                                        </Menu.Item>
                                    </Menu.Menu>
                                </Menu.Item>
                                    <Menu.Item as={Link} to="/impressum" name='impressum' active={activeItem === 'impressum'} onClick={this.handleItemClick}>
                                        <p>Impressum</p>
                                    </Menu.Item>
                                    <Menu.Item name='logout' active={activeItem ==='logout'} onClick={this.handleItemClick}>
                                        <p>Logout</p>
                                </Menu.Item>
                            </Menu.Item>
                        </Menu>
                    </div>
                        <div style={{position:"fixed",zIndex:"2",right:"2%",bottom:"8%",height:"5%",width:"5%"}}><CircularProgressbar percentage={this.state.timePassed*5} textForPercentage={(pct) => `${pct/5}`} /></div>
                    </div>
                :   <div>
                        <div className="topnav" id="myTopnav">
                            <Menu horizontal>
                                <Menu.Item>
                                    <Menu.Header as={Menu.Item} id="menuheader_top" className="menuheader_top">
                                        <p>StrawBerrySaver</p>
                                    </Menu.Header>
                                    <Menu.Item className="icon" onClick={function responsiveMenu2() {
                                        let x = document.getElementById("myLeftnav");

                                        if (x.style.display === "block") {
                                            x.style.display = "none";
                                        }
                                        else{
                                            x.style.display="block";
                                        }

                                        if (x.className === "leftnav") {
                                            x.className = "responsive leftnav ";
                                        } else {
                                            x.className = "leftnav";
                                        }

                                    }}>
                                        <p>&#9776;</p>
                                    </Menu.Item>
                                </Menu.Item>
                            </Menu>
                        </div>

                        <div  className="leftnav" id="myLeftnav">
                            <Menu horizontal>
                                <Menu.Item as={Link} to="/login" name='login' active={activeItem === 'login'} onClick={this.handleItemClick}>
                                    <p>Login</p>
                                </Menu.Item>
                                <Menu.Item as={Link} to="/register" name='register' active={activeItem === 'register'} onClick={this.handleItemClick}>
                                    <p>Registrierung</p>
                                </Menu.Item>
                                <Menu.Item as={Link} to="/impressum" name='impressum' active={activeItem === 'impressum'} onClick={this.handleItemClick}>
                                    <p>Impressum</p>
                                </Menu.Item>
                            </Menu>
                        </div>

                    </div>

                }


            </div>
        )
    }
}