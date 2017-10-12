import React from 'react';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Card, CardHeader, CardTitle, CardText, CardSubtitle } from 'react-mdc-web';
import 'material-components-web/dist/material-components-web.min.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './OptionProgress.css';

/**
 * This component shows the percent of votes for a single option
 */
class OptionProgress extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    votes: PropTypes.number.isRequired,
    maxVotes: PropTypes.number.isRequired,
    className: PropTypes.string.isRequired,
  }

  static defaultProps = {
    className: '',
  }
  
  constructor() {
    super();
    this.state = {
      votePercentage: 0,
    }
  }

  componentWillMount() {
    const percentOutOf100 = Math.floor((this.props.votes/this.props.maxVotes) * 100)
    this.setState({ votePercentage: percentOutOf100 })
  }

  render() {
    return (
      <Card className={`option-progress ${this.props.className}`}>
        <CardHeader className="option-progress-title" >
          <CardTitle>{ this.props.title }</CardTitle>
          <CardSubtitle>{ this.props.desc }</CardSubtitle>
          <CardSubtitle><i>Votes Received: { this.props.votes }</i></CardSubtitle>
        </CardHeader>
        <CardText className="option-progress-text" >
          <svg width="100%" height="100" className="progression-svg-container" >
            <rect width={`${this.state.votePercentage}%`} height="100%" className="progression-rect-svg" />
          </svg>
        </CardText>
      </Card>
    )

  }
}
 export default OptionProgress;
