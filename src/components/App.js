import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useHistory
} from 'react-router-dom';
import Login from './Login.js';
import Register from './Register.js';
import Ducks from './Ducks.js';
import MyProfile from './MyProfile.js';
import ProtectedRoute from './ProtectedRoute';
import * as duckAuth from '../duckAuth.js';
import './styles/App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const history = useHistory();

  const auth = async (jwt) => {
    return duckAuth.getContent(jwt)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setUserData({
            username: res.username,
            email: res.email
          });
        }
      })
  };

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      auth(jwt);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) history.push('/ducks');
  }, [loggedIn]);

  const onRegister = ({ username, password, email }) => {
    return duckAuth.register(username, password, email).then((res) => {
      if (!res || res.statusCode === 400) throw new Error('Что-то пошло не так');
      return res;
    });
  };

  const onLogin = ({ username, password }) => {
    return duckAuth.authorize(username, password).then((res) => {
      if (!res) throw new Error('Неправильные имя пользователя или пароль');
      if (res.jwt) {
        setLoggedIn(true);
        localStorage.setItem('jwt', res.jwt);
      }
    });
  };

  const onSignOut = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    history.push('/login');
  };

  return (
    <Router>
      <Switch>
        <ProtectedRoute
          exact
          path="/ducks"
          loggedIn={loggedIn}
          onSignOut={onSignOut}
          component={Ducks}
        />
        <ProtectedRoute
          exact
          path="/my-profile"
          loggedIn={loggedIn}
          userData={userData}
          onSignOut={onSignOut}
          component={MyProfile}
        />
        <Route exact path="/login">
          <div className="loginContainer">
            <Login onLogin={onLogin} />
          </div>
        </Route>
        <Route exact path="/register">
          <div className="registerContainer">
            <Register onRegister={onRegister} />
          </div>
        </Route>
        <Route>
          {loggedIn ? <Redirect to="/ducks" /> : <Redirect to="/login" />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;