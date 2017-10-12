import React from 'react';
import './Detail.css';
import {Fab} from 'react-mdc-web';

class PollOptions extends React.Component {
  constructor(props) {
    super(props);
    this.renderOption = this.renderOption.bind(this);
  }  

  renderOption(key) {
    const option = this.props.options[key]
    return (
      <div className='render-option-item' key={key}>
        <p>{ option.title }
        <span> ({ option.desc })</span></p>
        <Fab mini className="fab" id="remFab" onClick={ () => this.props.removeOption(key)}><i className="material-icons">clear</i></Fab>
      </div>
    )
  }
  render() {
    return (
      <div className='PollOptions'> 
        <div className="input-group">
          <ul>
            { Object.keys(this.props.options).map(this.renderOption) }
          </ul>
        </div>
      </div>
    );
  }
}

export default PollOptions;

