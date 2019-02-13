import React, { Component } from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SignUp from './RegisterValidation'
import {Provider} from 'react-redux';
import Store from  './store'
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
