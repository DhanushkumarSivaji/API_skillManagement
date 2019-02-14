import React, { Component } from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import './App.css';

import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken'
import {setCurrentUser, logoutUser} from './actions/authAction'



import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SignUp from './RegisterValidation'
import {Provider} from 'react-redux';

import Store from  './store'


//check for token
if(localStorage.jwtToken){
  //set auth token header auth
  setAuthToken(localStorage.jwtToken)
  //Deocode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken)
  //set user and isAuthenticated
  Store.dispatch(setCurrentUser(decoded))

  //check for expired token
  const currentTime = Date.now() / 1000;

  if(decoded.exp < currentTime) {
    //logout user
    Store.dispatch(logoutUser());
    //TODO: Clear current profile

    //Redirect to login
    window.location.href = '/login'
  }
}




class App extends Component {
  render() {
    return (
      <Provider store={Store}>
      <Router>
      <div className="App">
        <Navbar/>
        <Route exact path="/" component={Landing}/>
        
        <div className="container">
        <Route exact path="/register" component={Register}/>
        <Route exact path="/signup" component={SignUp}/>
        <Route exact path="/login" component={Login}/>
        </div>
        <Footer/>
      </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
