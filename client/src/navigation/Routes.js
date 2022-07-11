
import { Redirect, Route } from "react-router-dom";

import { HomePage, Doctors } from "../pages";
import { RoutesConstant, StringConstant } from "../assets/constants";
import PrivateRoutes from "./PrivertRoutes";

export default () =>{
    return[
        <PrivateRoutes
          exact
          key="home"
          path={RoutesConstant.home}
          component={HomePage}
        />,
        <PrivateRoutes
          exact
          key="doctors"
          path={RoutesConstant.doctors}
          component={Doctors}
        />,

    ]
}