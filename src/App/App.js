import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom'
import Detail from '../Detail/Detail.js'
import Home from '../Home/Home.js'
import Landing from '../Landing/Landing.js'
import SignIn from '../SignIn/SignIn.js'
import Vote from '../Vote/Vote.js'
import Results from '../Results/Results.js'
import { init as firebaseInit } from '../firebase.js'

/**
 * The base component for our entire application. This component
 * is responsible for delegating client side routing.
 */
class App extends Component {

  constructor() {
    super()
    firebaseInit()
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route path='/home' component={Home} />
          <Route path='/detail' component={Detail} />
          <Route path='/results/:pollId' component={Results} />
          <Route path='/vote/:pollId' component={Vote} />
          <Route exact path='/signin' component={SignIn} />
        </Switch>
      </div>
    );
  }
}

export default App;
