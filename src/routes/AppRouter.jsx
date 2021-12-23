// Libraries

import React, { useState } from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';

// Components

import { CurrentDataManagerContext } from '../context/CurrentDataManagerContext';
import { DataContext } from '../context/DataContext';
import { DataTableContext } from '../context/DataTableContext';
import { InfoComponentContext } from '../context/InfoComponentContext';
import { LimitDataContext } from '../context/LimitDataContext';
import { OffsetContext } from '../context/OffsetContext';
import CompanyScreen from '../pages/CompanyScreen/CompanyScreen';
import ContactsScreen from '../pages/ContactsScreen';
import LocationScreen from '../pages/LocationScreen/LocationScreen';
import UserScreen from '../pages/UserScreen/UserScreen';

// Functions

/**
 * 
 * @returns Every route that belongs to the private routes.
 * With this component is possible the redirect when the user is logged on the app. (for now it doesn't work very well.)
 */

const AppRouter = () => {

    /**
     * State that allows change the class name to the "Data Manager" component.
     */

    const [closeNode, setCloseNode] = useState("data-manager-bg");

    /**
     * The default value to the "infoComponent" state.
     */

    const createUserObj = {
        title_component: "",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                owner_data: ""
            },
            {
                title: "Apellido",
                require: false,
                type: "text",
                name: "last_name",
                owner_data: ""
            },
            {
                title: "Correo Electrónico",
                require: true,
                type: "email",
                name: "email",
                owner_data: ""
            },
            {
                title: "Perfil",
                require: true,
                type: "text",
                name: "profile",
                owner_data: ""
            },
            {
                title: "Contraseña",
                require: true,
                type: "password",
                name: "password"
            },
            {
                title: "Repetir Contraseña",
                require: true,
                type: "password",
                name: "confirm_password"
            }
        ],
        pic: false
    }

    /**
     * State that allow set all setting to the "Data Manager" depending of the type from this component.
     */

    const [infoComponent, setInfoComponent] = useState(createUserObj);

    /**
     * State that allow set the type of the "Data Manager".
     */

    const [current, setCurrent] = useState("new");

    /**
     * Gets an updated version of all data from the data base and allow to send the state to every page on the app.
     */

    const [allData, setAllData] = useState([]);

    /**
     * Sets the limit of data that can be render on the screen.
     */

    const [limit, setLimit] = useState(10);

    /**
     * Allows to set the offset of data that can be render on the screen.
     */

    const [offset, setOffset] = useState(0);

    return (
        <>
            <Switch>
                <DataContext.Provider value={{closeNode, setCloseNode}}>
                <InfoComponentContext.Provider value={{infoComponent, setInfoComponent}}>
                <CurrentDataManagerContext.Provider value={{current, setCurrent}}>
                <DataTableContext.Provider value={{allData, setAllData}}>
                <LimitDataContext.Provider value={{limit, setLimit}}>
                <OffsetContext.Provider value={{offset, setOffset}}>
                    <Route exact path="/contact" component={ContactsScreen} />
                    <Route exact path="/company" component={CompanyScreen} />
                    <Route exact path="/user" component={UserScreen} />
                    <Route exact path="/location" component={LocationScreen} />
                </OffsetContext.Provider>
                </LimitDataContext.Provider>
                </DataTableContext.Provider>
                </CurrentDataManagerContext.Provider>
                </InfoComponentContext.Provider>
                </DataContext.Provider>
                <Redirect to="/contact"/>
            </Switch>
        </>
    )
}

export default AppRouter;