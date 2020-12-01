import React from 'react';
import './App.css';
import { Route, Redirect, Switch } from 'react-router-dom';

import Auth from './pages/Auth';
import Bookings from './pages/Bookings';
import Events from './pages/Events';
import MainNavigation from './components/Navigation/MainNavigation';

function App() {
    return (
        <React.Fragment>
            <MainNavigation />
            <main className="main-content">
                <Switch>
                    <Redirect from="/" to="/auth" exact />
                    <Route path="/auth" component={Auth} />
                    <Route path="/events" component={Events} />
                    <Route path="/bookings" component={Bookings} />
                </Switch>
            </main>
        </React.Fragment>
    );
}

export default App;
