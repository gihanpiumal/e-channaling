import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { appRoutes } from "./navigation";

import './App.css';

const App=()=> {
  let routes = <Switch>{appRoutes()}</Switch>;
  return (
    <div className="App">
    <BrowserRouter>{routes}</BrowserRouter>
    </div>
  );
}

export default App;
