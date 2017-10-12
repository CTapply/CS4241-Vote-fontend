import React from 'react'
import {Redirect } from 'react-router-dom'
import { Button } from 'react-mdc-web';
import 'material-components-web/dist/material-components-web.min.css';
import './SignIn.css'

/**
 * This component serves as the web app's langing page. It directs
 * users to login to create polls.
 */
class SignIn extends React.Component {
  constructor(){
    super()
    this.state = {
      redirect: false
    }
  }

  render() {
    if (this.state.redirect){
      return (<Redirect to="/home"/>)
    }
    return (
      <div className="SignIn">
        <Button className="mdc-button" raised onClick={() => {
          // let user = googleSignIn()
          this.setState({redirect: true})
        }}>GOOGLE</Button>
      </div>
    )
  }
}

export default SignIn;