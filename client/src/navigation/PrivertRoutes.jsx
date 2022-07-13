import { Route, Redirect } from "react-router-dom";

const PrivateRoutes = ({ exact, key, path, component: Component }) => {
  return (
    <Route
      exact={exact}
      key={key}
      path={path}
      render={(props) => {
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoutes;
