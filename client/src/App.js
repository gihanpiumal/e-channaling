import React from "react";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";

import { RoutesConstant } from "./assets/constants";
import { appRoutes } from "./navigation";
import { NavBar, Footer } from "./components";

import "./App.css";

const App = () => {
  let routes = (
    <Switch>
      {appRoutes()}, <Redirect to={RoutesConstant.home} />
    </Switch>
  );
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        {routes}
        <Footer/>
      </BrowserRouter>
    </div>
  );
};

export default App;
