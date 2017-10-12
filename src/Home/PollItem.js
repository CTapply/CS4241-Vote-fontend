import React from 'react'
import './Home.css'
import { getCurrentUser } from '../firebase.js'

/**
 * This component is a list of the user's polls that they've voted in or created.
 */
class PollItem extends React.Component {

	render () {
		const{details} = this.props;
  		return (
  			<li className="pollItem">
  				<div className="pollDetails">
  				<div className="pollText">
  					<p className="pollTitle"><a className="pollItemLink" href={`/detail/`}> {details.title} </a></p>
  					<Userrole uid={this.isOwner()}/>
  					<Closebttn uid={this.isOwner()}/>
  					<span className="ballotsSum"> {this.countBallots()} </span>
  				</div>
  				</div>
  			</li>
		)
	}

	countBallots() {
		return Object.keys(this.props.details.ballots).length;
	}

	isOwner() {
		if(getCurrentUser() === this.props.details.owner){
			return true;
		} else {
			return false;
		}
	}


}

const Closebttn = (props) => {
	if(props.uid) {
		return <button className="closeButton">Close Poll</button>
	} else {
		return <span className="closeButton"></span>;
	}
}

const Userrole = (props) => {
	if(props.uid){
		return <span className="pollRole">- Owner</span>;
	} else {
		return <span className="pollRole">- Participant</span>;
	}
}


export default PollItem;