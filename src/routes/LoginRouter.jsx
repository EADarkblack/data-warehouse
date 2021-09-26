// Libraries

import React, { useContext } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

// Components

import Navbar from '../components/Navbar/Navbar';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../pages/LoginScreen/LoginScreen';
import AppRouter from './AppRouter';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Functions

const LoginRouter = () => {

    /**
     * Gets the "log" from the auth reducer to send as an prop to the both routes from the component.
     */

    const {log} = useContext(AuthContext);
    
    return (
        <Router>
            <Navbar />
            <Switch>
                <PublicRoute path="/login" auth={log} component={LoginScreen}/>
                <PrivateRoute path="/" auth={log} component={AppRouter} />
            </Switch>
        </Router>
    )
}

export default LoginRouter
