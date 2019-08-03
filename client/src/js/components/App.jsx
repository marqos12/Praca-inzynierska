import React from "react";
import Home from "./Home.jsx";
import Login from "./auth/Login.jsx";
import Registration from "./auth/Registration.jsx";
import "./css/main.scss";

import { Route } from 'react-router-dom'

const App = () => (
  
  <div className="app">
    
    <Route exact path="/" component={Home}/>
    <Route exact path="/login" component={Login}/>
    <Route exact path="/registration" component={Registration}/>
    
  </div>
);
export default App;