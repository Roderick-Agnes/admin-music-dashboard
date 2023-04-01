import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import Users from "./pages/Users";

import Main from "./components/layout/Main";
import { Toaster } from "react-hot-toast";

import { useSelector } from "react-redux";

import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Loader from "./components/loader";
import { checkLoading, isLogon } from "./reducer";
import Songs from "./pages/Songs";

function App() {
  // store
  const isLoading = useSelector(checkLoading);
  const userLogon = useSelector(isLogon);

  return (
    <div className="App">
      <Toaster position="top-right" reverseOrder={false} />
      <Loader isLoading={isLoading} />
      <Switch>
        <Route path="/sign-in" exact component={SignIn} />

        <Main>
          <Route exact path="/users" component={Users} />
          <Route exact path="/songs" component={Songs} />
          <Route exact path="/playlists" component={Tables} />
          <Redirect from="*" to={userLogon ? "/users" : "/sign-in"} />
        </Main>
      </Switch>
    </div>
  );
}

export default App;
