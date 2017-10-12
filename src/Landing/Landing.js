import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { getCurrentUser } from '../firebase.js'
import { Button } from 'react-mdc-web';
import 'material-components-web/dist/material-components-web.min.css';

/**
 * This component serves as the web app's langing page. It directs
 * users to login to create polls.
 */
const Landing = (props) => {
  if(getCurrentUser() && !getCurrentUser().isAnonymous){
    console.log(`moving ${getCurrentUser()} to /home`)
    return (<Redirect to="/home" push />)
  }
  return (
    <div className="Landing">
      <h1>Welcome to FireVote!</h1>
      <div>FireVote is a web app that allows you to easily share hyperlinks to ballots that anyone can vote in.</div>
      <div>FireVote uses instant runoff voting to guarantee that voters can vote for options without having to worry about strategic voting or the spoiler affect.</div>
      <div>
        <Button raised><Link to="/detail">GET STARTED</Link></Button>
      </div>
    </div>
  )
}

export default Landing;