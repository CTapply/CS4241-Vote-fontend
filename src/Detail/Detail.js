import React from 'react'
import './Detail.css'
import PollOptions from './PollOptions.js'
import AddOption from './AddOption.js'
import {Button} from 'react-mdc-web'
import { addPoll } from '../firebase.js'
import { Redirect } from 'react-router-dom'

/**
 * This component will probably be used to edit/create a poll. 
 */
class Detail extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	userId: "",
	    	dateCreated: Date.now(),
	    	title: "", 
	    	desc: "", 
	    	numWinners: 0, 
	    	options: [], 
	    	redirect: false
	    }
	    this.addOption = this.addOption.bind(this);
	    this.removeOption = this.removeOption.bind(this);
	    this.handleNumWinners = this.handleNumWinners.bind(this);
	    this.newTitle = "";
	    this.newDesc = "";
	    this.refKey = "";
	}

	onSubmit = () => {
		//console.log("Add: " + this.newTitle.value + this.newDesc.value)
		this.setState( {title: this.newTitle.value, desc: this.newDesc.value}, function() {
			console.log("Title: " + this.state.title)
			console.log("Desc: " + this.state.desc)
			const poll = { // Create poll object to push to firebase 
				userId: this.state.userId,
				dateCreated: this.state.dateCreated, 
				title: this.state.title,
				desc: this.state.desc,
				numWinners: this.state.numWinners,
				options: this.state.options
			}
			this.refKey = addPoll(poll);
			this.setState( {redirect: true} );
		})
	}

	addOption(option) {
		const options = {...this.state.options};
		options[`option-${Date.now()}`] = option;
		this.setState({ options })
		//console.log("Options state:" + this.state.options); 
	}

	removeOption(key) {
		let optionsCopy = this.state.options
	    delete optionsCopy[key] 
	    this.setState( {options: optionsCopy} )
	}

	handleNumWinners(event) {
		const newNumWinners = event.target.value
		//console.log("numwinners:" + newNumWinners)
		this.setState({ numWinners: newNumWinners })
	}

	showDescription() {
		document.getElementById("pollDescDiv").style.display = "block";
		document.getElementById("descBtn").style.display = "none";
	}
	
	render() {
		if (this.state.redirect) {
			return <Redirect to={`/vote/${this.refKey}`}/>
		}
		return (
		    <div className="Detail">
		    	<h1>CREATE A POLL</h1>
		    	<div className="input-group" id="pollInputs">
		    		<div id="pollNameDiv">
				        <h3>What do you want to call your poll?</h3>
				        <input name='pollName' 
				            ref={(input) => this.newTitle = input}
				            type='text'
				            placeholder='Poll Name'/>
				    </div>

				    <Button raised id="descBtn" onClick={this.showDescription}>ADD POLL DESCRIPTION</Button>
				    <div id="pollDescDiv">
				        <h3>Poll Description</h3>
				        <input name='pollDesc' 
				            ref={(input) => this.newDesc = input}
				            type='text'
				            placeholder='Poll Description'/>
			        </div>
				</div>

		        <div id="numWinnersDiv">
		        	<h3>Choose the number of winners</h3>
		        	<Button raised onClick={this.handleNumWinners} value="1">1</Button>
		        	<Button raised onClick={this.handleNumWinners} value="2">2</Button>
		        	<Button raised onClick={this.handleNumWinners} value="3">3</Button>
		        	<Button raised onClick={this.handleNumWinners} value="4">4</Button>
		        	<Button raised onClick={this.handleNumWinners} value="5">5</Button>
		        	<Button raised onClick={this.handleNumWinners} value="6">6</Button>
		        	<Button raised onClick={this.handleNumWinners} value="7">7</Button>
		        	<Button raised onClick={this.handleNumWinners} value="8">8</Button>
		        	<Button raised onClick={this.handleNumWinners} value="9">9</Button>
		        	<Button raised onClick={this.handleNumWinners} value="10">10</Button>
		        </div>
			  	
			  	<div id="optionsDiv">
				  	<h3>Change Poll Options</h3>
			        <AddOption 
			        	addOption={this.addOption}/>

				  	<div id="listCurOptions">
					    <PollOptions
					    	options={this.state.options}
					    	removeOption={this.removeOption}>
					    </PollOptions>
				    </div>
				</div>

				<div><Button id="createPollBtn" raised onClick={this.onSubmit}>CREATE POLL</Button></div>

			</div>
		)
	}
}

export default Detail;