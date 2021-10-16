// Libraries

import { authTypes } from "../types/authTypes";

// Functions

/**
 * 
 * @param {{state}} state Return the initial state from the app.
 * @param {{action}} action Return an object with every action that will allow verify if the user is logged on the app.
 * @returns every return on the reducer return different results, in the "case" options the return just change the log's state.
 */

export const AuthReducer = (state, action) => {
    switch (action.type) {
        case authTypes.login:
            return {log: true};
        case authTypes.logout:
            return {log: false};
        default:
            return state;
    }
}