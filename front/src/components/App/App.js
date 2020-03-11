import React from 'react';
// import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from '../Home/homepage'
import './App.css';

export default class App extends React.Component {

  render() {
    console.log("app render");
    return (
      <Router>
          <Switch>
            <Route path='/' component={Homepage} />
          </Switch>
      </Router>
    );
  }
}
