import React from 'react';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Card, CardHeader, CardTitle, CardText, CardSubtitle, Tabbar, Tab, LinearProgress } from 'react-mdc-web';
import { Carousel } from 'react-responsive-carousel';
import 'material-components-web/dist/material-components-web.min.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import OptionProgress from './ResultProgression/OptionProgress';
import './Results.css';

/**
 * This component shows the results for a given poll
 */
class Results extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 1,
      pollId: this.props.match.params.pollId,
      result: {},
      poll: {},
    }
  }

  componentWillMount() {
    firebase.database().ref("/polls/"+ this.state.pollId).once('value')
    .then((snapshot) => {
      let poll = snapshot.val();
      console.log(poll)
      this.setState({ poll });
    })
    const fetchData = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pollId: this.state.pollId,
      }),
    };
    // // Get the poll initially when we go to the results page
    // fetch('http://localhost:9000/poll', fetchData)
    // .then(response => response.json())
    // .then((poll) => {
    //   console.log('we got the inital Poll!: ', poll)
    //   this.setState({ poll });
    // });
    
    // Get the results initially when we go to the results page
    fetch('https://cs4241-vote-backend.herokuapp.com/results', fetchData)
    .then(response => response.json())
    .then((results) => {
      console.log('we got the initial Results!: ', results)
      this.setState({ result: results });
    });

    // firebase.database().ref(`/polls/${this.state.pollId}/results`).on('value', snap => {
    //   fetch('http://localhost:9000/results', fetchData)
    //   .then(response => response.json())
    //   .then((results) => {
    //     console.log('we got changes in the Results!: ', results)
    //     this.setState({ result: results });
    //   });
    // })

    // firebase.database().ref(`/polls/${this.state.pollId}`).on('value', snap => {
    //   fetch('http://localhost:9000/poll', fetchData)
    //   .then(response => response.json())
    //   .then((poll) => {
    //     console.log('we got changes in the Poll!: ', poll)
    //     this.setState({ poll });
    //   });
    // })
  }

  getOptionById = (id) => this.state.poll.options[id];

  getLoserIds = () => _.difference(Object.keys(this.state.poll.options), Object.values(this.state.poll.results))
  

  renderCorrectTab = () => {
    console.log(Object.keys(this.state.poll))
    if(Object.keys(this.state.poll).length === 0){
      return null;
    }
    switch(this.state.activeTab) {
      case 1:
        return this.renderFinalResults();
        case 2:
          return this.renderPollProgression();
      default: 
        return this.renderFinalResults();
    }
  }

  renderPollProgression = () => (
    <div>
      <Carousel showThumbs={false} >
        { this.renderPollProgressItems() }
        {/* <div className="carousel-item">
          <OptionProgress title="Title Here" desc="Desc here!!" votes={6} maxVotes={59} />
          <OptionProgress title="Title Here" desc="Desc here!!" votes={26} maxVotes={59} />
          <OptionProgress title="Title Here" desc="Desc here!!" votes={59} maxVotes={59} />
          <OptionProgress title="Title Here" desc="Desc here!!" votes={1} maxVotes={59} />
        </div>
        <div className="carousel-item">
          <OptionProgress title="Title Here" desc="Desc here!!" votes={6} maxVotes={59} />
          <OptionProgress title="Title Here" desc="Desc here!!" votes={26} maxVotes={59} />
          <OptionProgress title="Title Here" desc="Desc here!!" votes={59} maxVotes={59} />
          <OptionProgress title="Title Here" desc="Desc here!!" votes={50} maxVotes={59} />
        </div> */}
      </Carousel>
    </div>
  )
  
  renderPollProgressItems = () => {
    if (!this.state.poll.results || !this.state.result.trace) {
      console.log(this.state.result)
      return null;
    }
    const numberOfSlides = this.state.result.trace.candidates.length;
    const carouselItems = [];
    for (let index = 0; index < numberOfSlides; index++) {
      const candidatesArray = this.state.result.trace.candidates[index];
      const winnersArray = this.state.result.trace.winners[index];

      let maxVotesHere = 0;

      candidatesArray.forEach((candidate) => {
        if (candidate.votes.length > maxVotesHere) {
          maxVotesHere = candidate.votes.length;
        }
      })

      winnersArray.forEach((candidate) => {
        if (candidate.votes.length > maxVotesHere) {
          maxVotesHere = candidate.votes.length;
        }
      })
      
      carouselItems.push(
        <div key={index} className="carousel-item">
          <h2>Winners</h2>
          {_.map(winnersArray, (winner) => {
            {/* console.log(winner)
            console.log(this.poll.options[winner.id]) */}
            const option = this.state.poll.options[winner.id];
            const numVotes = winner.votes.length;
            return (<OptionProgress key={winner.id} className="winnner-progress" title={option.title} desc={option.desc} votes={numVotes} maxVotes={maxVotesHere} />)
          })}
          <h2>Standing Candidates</h2>
          {_.map(candidatesArray, (candidate) => {
            {/* console.log(candidate)
            console.log(this.poll.options[candidate.id]) */}
            const option = this.state.poll.options[candidate.id];
            const numVotes = candidate.votes.length;
            return (<OptionProgress key={candidate.id} className="candidate-progress" title={option.title} desc={option.desc} votes={numVotes} maxVotes={maxVotesHere} />)
          })}
      </div>)
    }
    return carouselItems;
  }

  renderFinalResults = () => {
    if (!this.state.poll.results) {
      return null;
    }
    return (<div>
      <div id="winners">
        <h1>Winning Candidates:</h1>
          {Object.values(this.state.poll.results).map(result => {
            console.log(result)
            const option = this.getOptionById(result)
            return (
              <div className="result" key={option.title} >
              <Card>
                <CardHeader>
                  <CardTitle>{ option.title }</CardTitle>
                  <CardSubtitle></CardSubtitle>
                </CardHeader>
                <CardText>
                  { option.desc }
                </CardText>
              </Card>
              </div>
            )
          })
          }
      </div>
      <div id="losers">
        <h1>Losing Candidates:</h1>
          {this.getLoserIds().map(loserId => {
            const option = this.getOptionById(loserId)
            return (
              <div className="result" key={ option.title } >
              <Card>
                <CardHeader>
                  <CardTitle>{ option.title }</CardTitle>
                  <CardSubtitle></CardSubtitle>
                </CardHeader>
                <CardText>
                  { option.desc }
                </CardText>
              </Card>
              </div>
            )
          })
          }
      </div>
    </div>)
  }

  render() {
    return (
      <div>
        <h1>{ this.state.poll.title }</h1>
        <Tabbar>
          <Tab 
            active={this.state.activeTab === 1}
            onClick={() => {this.setState({ activeTab: 1 })}}
          >
            Final Results!
          </Tab>
          <Tab 
            active={this.state.activeTab === 2}
            onClick={() => {this.setState({ activeTab: 2 })}}
          >
            See Poll Progression
          </Tab>
          <span className="mdc-tab-bar__indicator"></span>
        </Tabbar>
        <br />
        {this.renderCorrectTab()}
      </div>
    )
  }
}

export default Results;
