// Libraries

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// Functions

/**
 * 
 * @param {{auth, component, ...rest}} param0 receives from the login Router all props to make the verification if the user is logged on the app to allow show every private route to the user. 
 * @returns Depending from the result of the ternary condition can be return to the user to the login page or can give access to the user.
 */

const PrivateRoute = ({auth, component: Component, ...rest}) => {
    return (
        <Route {...rest} component={(props) => auth.log ? <Component {...props} /> : <Redirect to="/login" />}/>
    )
}

export default PrivateRoute;