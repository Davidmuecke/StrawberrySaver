import React, {Component} from 'react';
import { Tab } from "semantic-ui-react";
import LineChart from './ForeCastChart';
const panes = [
    { menuItem: 'Temperatur', render: () => <Tab.Pane><div className="tempchart" ><LineChart type="temp" appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"/> </div></Tab.Pane>},
    { menuItem: 'Luftfeuchtigkeit', render: () => <Tab.Pane><div className="humiditychart" > <LineChart type="humidity" appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"/> </div></Tab.Pane>},
    { menuItem: 'Regen', render: () => <Tab.Pane><div className="rainchart" ><div/>  <LineChart type="rain" appid="9e875e006011c294e09b4ee38bec12bf" cityID="2825297"/></div></Tab.Pane>},

];
export default class ForecastMenu extends Component{
    render(){
        return(
            <div className="forecast" >
                <h3>Vorbericht</h3>
                <Tab menu={{ fluid: true, vertical: true, tabular: 'right' }} panes={panes} />
            </div>
        );
    }
}