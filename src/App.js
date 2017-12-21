import React, { Component } from 'react';
import './App.css';
import {helpers} from "./flux/helper";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {isToggleOn: true};
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick (){
        //handle login
        helpers.redirectToFluxLogin();
    }
  render() {
    return (
      <div className="App">
          <div id='login'>
              <div className='button' onClick={this.handleClick}>Login</div>
          </div>
      </div>
    );
  }

}

export default App;
