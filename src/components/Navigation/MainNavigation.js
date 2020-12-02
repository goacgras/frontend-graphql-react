import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import './MainNavigation.css';

const MainNavigation = () => {
    return (
        <AuthContext.Consumer>
            {(context) => {
                return (
                    <header className="main-navigation">
                        <div className="main-navigation__logo">
                            <h1>Gras-events</h1>
                        </div>
                        <nav className="main-navigation__items">
                            <ul>
                                {!context.token && (
                                    <li>
                                        <NavLink to="/auth">
                                            Authenticate
                                        </NavLink>
                                    </li>
                                )}

                                <li>
                                    <NavLink to="/events">Events</NavLink>
                                </li>
                                {context.token && (
                                    <React.Fragment>
                                        <li>
                                            <NavLink to="/bookings">
                                                Bookings
                                            </NavLink>
                                        </li>
                                        <li>
                                            <button onClick={context.logout}>
                                                logout
                                            </button>
                                        </li>
                                    </React.Fragment>
                                )}
                            </ul>
                        </nav>
                    </header>
                );
            }}
        </AuthContext.Consumer>
    );
};

export default MainNavigation;
