import React, { useState } from 'react';
import './App.css';
import { Route, Redirect, Switch } from 'react-router-dom';

import Auth from './pages/Auth';
import Bookings from './pages/Bookings';
import Events from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

function App() {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    const login = (token, userId, tokenExpiration) => {
        setToken(token);
        setUserId(userId);
    };

    const logout = () => {
        setToken(null);
        setUserId(null);
    };

    let routes = (
        <Switch>
            <Route path="/auth" component={Auth} />
            <Route path="/events" component={Events} />
            <Redirect from="/" to="/auth" />
        </Switch>
    );
    if (token) {
        routes = (
            <Switch>
                <Route path="/events" component={Events} />
                <Route path="/bookings" component={Bookings} />
                <Redirect from="/" to="events" />
            </Switch>
        );
    }

    return (
        <React.Fragment>
            <AuthContext.Provider
                value={{
                    token: token,
                    userId: userId,
                    login: login,
                    logout: logout
                }}
            >
                <MainNavigation />
                <main className="main-content">{routes}</main>
            </AuthContext.Provider>
        </React.Fragment>
    );
}

export default App;
