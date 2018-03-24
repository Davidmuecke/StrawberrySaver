import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Chart from './ActualChart';
import LineChart from './ForeCastChart';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));



ReactDOM.render(<Chart/>,document.getElementById('chart'));
ReactDOM.render(<LineChart/>,document.getElementById('forecast'));
registerServiceWorker();
