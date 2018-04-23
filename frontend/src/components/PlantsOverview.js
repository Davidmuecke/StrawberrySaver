import React, { Component } from 'react';
import {Grid,
        Segment,
        Button,
        Header,
        Container
        } from "semantic-ui-react";
import strawberry from '../img/strawbarry.png';
import gurke from '../img/gurke.png';
import haze from '../img/supersilverhaze.png';
import {API} from "aws-amplify/lib/index";
import { Link } from "react-router-dom";
export default class PlantsOverview extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            content: "Hallo",
            answer: ""
        };
        this.handleSubmit();
        this.props.callback(["Erdbeere","Gurke","Strawberry Kush"]);


    }

   handleSubmit= async() => {


        if (this.state.content.length === 0) {
            alert("No Content!");
            return;
        }

        this.setState({ isLoading: true });

        try {
            let reply = await this.arduinoTest({
                content: this.state.content
            });
            console.log(reply);

            this.setState({answer: [[reply[0].plantData.sortreply[0].plantData.plantationTime,reply[0].plantData.initialTimePlant,reply[0].plantData.local_position_ID,reply[0].plantData.location_ID],reply[1],reply[2]]});
            //this.setState({answer: reply});
            Plant(strawberry,reply[0].plantData.sort,0,reply[0].plantData.plantationTime,reply[0].plantData.initialTimePlant,reply[0].plantData.local_position_ID,reply[0].plantData.location_ID)
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    };
    arduinoTest(note) {
        /* let myInit = { // OPTIONAL
             headers: {}, // OPTIONAL
             response: true // OPTIONAL (return entire response object instead of response.data)
         }
         return API.get("strawberry","/hello-world",myInit ) */
        return API.post("strawberry", "/getPlantsForUser", {
            headers:{} ,
            body: {}
        });
    }

    render(){
        return (
            <Container fluid={true}>
            <Grid>
                <Grid.Column width={16} stretched>
                    <Header as='h1'>Uebersicht</Header>
                    <p>Hier können sie alle registrierten Pflanzen einsehen, klicken Sie auf Details umd die Detailseite der jeweiligen Pflanze aufzurufen</p>
                </Grid.Column>
                {Plant(gurke,"Gurke", 1,"01.04.18","01.04.18","Stuttgart","drinnen",1,"22°")}
                {Plant(haze,"Super Silver Haze", 2,"01.05.18","01.04.18","Duisburg","draussen",2,"25°")}
            </Grid>
            </Container>
        )
    }

}
//lokale position(draussen,drinnen
//fehlen noch ,temperaturabweichunggrün,temperaturabweichunggelb,wasserabweichunggrün,wasserabweichunggelb
const Plant = (image,sorte, id, einpflanzungszeitpunkt,erstellungszeitpunkt,geographischerOrt,lokaleposition,sensorid,temperaturwert) =>
{
    Component.handleClick = (e) => {};
    return (
        <Grid.Column width={8} stretched >
            <Segment>
                <img style={{float:"right"}} src={image} alt={""}/>
                <h2> Art: {sorte}</h2>
                <h4> Einpflanzungszeitpunkt: {einpflanzungszeitpunkt}</h4>
                <h4>Ort: {geographischerOrt}</h4>
                <h4>Temperatur: {temperaturwert}</h4>

                <br />
                <Button as={Link} to={"/plantDetail?name="+sorte} color="blue" onClick={this.handleClick}> Details </Button>
            </Segment>
        </Grid.Column>
    );
};
