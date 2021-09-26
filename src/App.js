// Libraries

import React, { useEffect, useReducer } from 'react';

// Components

import { AuthContext } from './context/AuthContext';
import { AuthReducer } from './reducers/AuthReducer';
import LoginRouter from './routes/LoginRouter';

// Functions

/**
 * 
 * @returns The initial state form the reducer.
 */

const init = () => {
  return JSON.parse(localStorage.getItem('log')) || {log: false};
}

const App = () => {

  /**
   * Gets the log and dispatch from the reducer.
   */

  const [log, dispatch] = useReducer(AuthReducer, {}, init);

  /**
   * When the "log" status is modified sets to the localstorage the new "log" status, this allows make the redirect on the login router component.
   */

  useEffect(() => {
    localStorage.setItem('log', JSON.stringify(log));
  }, [log])

  /**
   * The Provider allows use the "log" and the "dispatch" in all app, with this can send the log as prop to the private and public route to make the redirect a verify if the user is logged or not.
   */

  return <AuthContext.Provider value={{log, dispatch}}>
          <LoginRouter />
          </AuthContext.Provider>
}

export default App;