import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ViewPort from './ViewPort';
import registerServiceWorker from './registerServiceWorker';
import {helpers} from "./flux/helper";
// Check if we're coming back from Flux with the login credentials.
helpers.storeFluxUser()
// check that the user is logged in, otherwise show the login page
    .then(function() { return helpers.isLoggedIn() })
    .then(function(isLoggedIn) {
        if (isLoggedIn) {
            console.log('logged in');
            // if logged in, make sure the login page is hidden
            // create the viewport
            // get the user's projects from Flux
            // prepare the cell (key) select boxes
            ReactDOM.render(<ViewPort/>, document.getElementById('root'));
        } else {
            console.log('logged out');
            //show login
            ReactDOM.render(<App />, document.getElementById('root'));
        }
    });

registerServiceWorker();
