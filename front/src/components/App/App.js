import React from 'react';
// import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from '../Home/homepage'

import './App.css';

export default class App extends React.Component {

  render() {
    return (
      <Router>
        <MyNavbar/>
        <div className={"App"}>
          <Switch>
            <Route exact path='/' Component={Home} />
          </Switch>
        </div>
      </Router>
    );
  }
}
