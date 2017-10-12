import React from 'react'
import './Vote.css'
import { Button } from 'react-mdc-web';
import 'material-components-web/dist/material-components-web.min.css';
import AvailableOptionsList from './AvailableOptionsList.js'
import SortableChoiceList from './SortableChoiceList.js'
import { arrayMove } from 'react-sortable-hoc'
import { Redirect } from 'react-router-dom'
import { getOptions, castBallot, addPollToUser } from '../firebase.js'


/**
 * This component shows the ballot and allows people to rank ballot 
 * options. 
 */
class Vote extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      choices: [],
      redirect: false
    }
  }

  componentDidMount() {
    //Load options for poll
    getOptions(this.props.match.params.pollId)
      .then(snap => {
        console.log("options = ", snap.val())
        this.setState({ options: snap.val() })
      })
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(old => ({
      choices: arrayMove([...old.choices], oldIndex, newIndex)
    }));
  };

  onOptionClicked = (value) => {
    let choices = this.state.choices
    //We clicked an item that is already present REMOVE it
    if (choices.filter(c => c.id === value.id).length > 0) {
      this.setState(old => ({
        choices: old.choices.filter(c => c.id !== value.id)
      }))
      return
    }
    //The item is new let's ADD it
    this.setState(old => ({
      choices: [...old.choices, value]
    }))
  }

  /**
   * Called when the user submits a ballot. Pushes the voter id 
   * and choice Ids to firebase.
   */
  onSubmit = () => {
    const choiceIds = this.state.choices.map(c => c.id)
    if (choiceIds.length === 0) return
    castBallot(this.props.match.params.pollId, choiceIds)
    //Add poll to user's list
    addPollToUser(this.props.match.params.pollId)
    this.setState({ redirect: true })
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect to={`/results/${this.props.match.params.pollId}`}/>)
    }
    return (
      <div id="voteDiv">
        <div id="vote-options-div">
          <h3>Available options to rank</h3>
          <p id="availListInst">Click on the items below and they will appear in your ranked list on the right</p>
          <AvailableOptionsList options={this.state.options} onItemClick={this.onOptionClicked} />
        </div>
        <Button raised onClick={this.onSubmit}>CAST</Button>
        <div id="vote-choices-div">
          <h3>Your ranked list of options</h3>
          <p id="sortListInst">Drag each item in your ranked choice list using the :: to move it to a different ranking</p>
          <SortableChoiceList items={this.state.choices} onSortEnd={this.onSortEnd} useDragHandle={true} />
        </div>
      </div>
    )
  }
}

export default Vote;
