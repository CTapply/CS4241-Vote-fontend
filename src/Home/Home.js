import React from 'react'
import './Home.css'
import PollItem from './PollItem.js'
import { Fab } from 'react-mdc-web';
import { Icon } from 'react-mdc-web';
import { Redirect } from 'react-router-dom'
import 'material-components-web/dist/material-components-web.min.css';
import { getUsersPolls } from '../firebase'

/**
 * This component is a list of the user's polls that they've voted in or created.
 */
class Home extends React.Component {
  constructor() {
    super()
    this.state = ({
      usersPolls: [],
      redirect: false
    })
  }

  componentDidMount() {
    getUsersPolls().then(p => {
      console.log("p = ", p)
      this.setState({ usersPolls: p })
    })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/detail" />
    }
    if (this.state.usersPolls) {
      return (
        <div className="Home">
          <div className="addPoll">
            <Fab onClick={() => this.setState({ redirect: true })}><Icon name='add' /></Fab>
          </div>
          <h4>Your Polls</h4>
          <div>
            <ul className="pollList">
              {
                // console.log("home polls = ", this.state.usersPolls)
                this.state.usersPolls.map((poll, i) =>
                  <PollItem key={i} details={poll} />)
              }
            </ul>
          </div>
        </div>
      )
    } else {
      return (
        <div className="Home">
          <p>Loading...</p>
        </div>
      )
    }
  }
}

export default Home;