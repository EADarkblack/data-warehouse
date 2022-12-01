// Libraries

import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

// Components

import Navbar from '../components/Navbar/Navbar';
import { AuthContext } from '../context/AuthContext';
import { ChangeProfileContext } from '../context/ChangeProfileContext';
import LoginScreen from '../pages/LoginScreen/LoginScreen';
import AppRouter from './AppRouter';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Functions

const LoginRouter = () => {

    /**
     * An state that allows to set the user type in the navbar
     */

    const [profile, setProfile] = useState(false);

    /**
     * Gets the "log" from the auth reducer to send as an prop to the both routes from the component.
     */

    const { log } = useContext(AuthContext);

    return (
        <Router>
            <ChangeProfileContext.Provider value={{ profile, setProfile }}>
                <Navbar auth={log} />
                <Switch>
                    <PublicRoute path="/login" auth={log} component={LoginScreen} />
                    <PrivateRoute path="/" auth={log} component={AppRouter} />
                </Switch>
            </ChangeProfileContext.Provider>
        </Router>
    )
}

export default LoginRouter;