import React from 'react';
import {Button} from 'react-mdc-web';

class AddOption extends React.Component {
  constructor() {
    super();
    this.createOption= this.createOption.bind(this);
  }

  createOption(event) {
   event.preventDefault();

   const option = {
     title: this.title.value,
     desc: this.desc.value
   }

   //console.log("In AddOption class: " + option.title + ": " + option.desc);
   this.props.addOption(option);
   this.addOption.reset();
 }

 render() {
   return (
      <form ref={(input) => this.addOption = input} className="add-option" onSubmit={(e) => this.createOption(e)}>
        <input id='addOptionTitle' ref={(input) => this.title = input} type="text" placeholder="Option name" />
        <input id='addOptionDesc' ref={(input) => this.desc = input} placeholder="Option description"></input>
        <Button raised type="submit">ADD OPTION</Button>
      </form>
   )
 }
}

export default AddOption;
