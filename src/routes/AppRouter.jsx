// Libraries

import React from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';

// Components

import CompanyScreen from '../pages/CompanyScreen';
import ContactsScreen from '../pages/ContactsScreen';
import LocationScreen from '../pages/LocationScreen';
import UserScreen from '../pages/UserScreen/UserScreen';

// Functions

/**
 * 
 * @returns Every route that belongs to the private routes.
 * With this component is possible the redirect when the user is logged on the app. (for now it doesn't work very well.)
 */

const AppRouter = () => {
    return (
        <>
            <Switch>
                <Route exact path="/contact" component={ContactsScreen} />
                <Route exact path="/company" component={CompanyScreen} />
                <Route exact path="/user" component={UserScreen} />
                <Route exact path="/location" component={LocationScreen} />

                <Redirect to="/contact"/>
            </Switch>
        </>
    )
}

export default AppRouter;