import React from "react";
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Login from "pages/utils/login";
import Page404 from "pages/utils/page404";
import AddProducts from "pages/products/addProducts";
// Private route for authenticated users (manager or sudo)
const PrivateRoute = ({ component: Component, ...rest }) => {
  const role = sessionStorage.getItem("role");
  return (
    <Route
      {...rest}
      render={(props) =>
        role ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

// Sudo-only route
const SudoRoute = ({ component: Component, ...rest }) => {
  const role = sessionStorage.getItem("role");
  return (
    <Route
      {...rest}
      render={(props) =>
        role === "sudo" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <Route exact path="/login" component={Login} />
        
        {/* Private Routes for Authenticated Users */}
        <PrivateRoute exact path="/add-products" component={AddProducts} />

        {/* Redirect to login if no match */}
        <Route exact path="/" component={Login} />
        <Route component={Page404} />
      </Switch>
    </Router>
  );
}
