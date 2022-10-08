// Libraries

import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// Components

import { CurrentDataManagerContext } from '../context/CurrentDataManagerContext';
import { DataContext } from '../context/DataContext';
import { DataTableContext } from '../context/DataTableContext';
import { InfoComponentContext } from '../context/InfoComponentContext';
import { LimitDataContext } from '../context/LimitDataContext';
import { OffsetContext } from '../context/OffsetContext';
import { DataInputsContext } from '../context/DataInputsContext';
import { ButtonContext } from '../context/ButtonContext';
import CompanyScreen from '../pages/CompanyScreen/CompanyScreen';
import ContactsScreen from '../pages/ContactsScreen';
import LocationScreen from '../pages/LocationScreen/LocationScreen';
import UserScreen from '../pages/UserScreen/UserScreen';
import { ModalDataInputContext } from '../context/ModalDataInputContext';
import { MoreInfoContext } from '../context/MoreInfoContext';

// Functions

const AppRouter = () => {

    /**
     * States and data to send by contexts.
     */

    const [closeNode, setCloseNode] = useState("data-manager-bg");

    const [current, setCurrent] = useState("new");

    const [allData, setAllData] = useState([]);

    const [limit, setLimit] = useState(10);

    const [offset, setOffset] = useState(0);

    const [uuid, setUuid] = useState({});

    const [inputData, setInputData] = useState({});

    const [moreInfo, setMoreInfo] = useState([]);

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

    const [infoComponent, setInfoComponent] = useState(createUserObj);

    const [activeBtn, setActiveBtn] = useState(
        [
            {
                class: "cancel",
                text: "Cancelar",
                type: "button"
            },
            {
                class: "save-user",
                text: "Guardar cambios",
                type: "button"
            }
        ]
    )

    return (
        <>
            <Switch>
                <DataContext.Provider value={{ closeNode, setCloseNode }}>
                    <InfoComponentContext.Provider value={{ infoComponent, setInfoComponent }}>
                        <CurrentDataManagerContext.Provider value={{ current, setCurrent }}>
                            <DataTableContext.Provider value={{ allData, setAllData }}>
                                <LimitDataContext.Provider value={{ limit, setLimit }}>
                                    <OffsetContext.Provider value={{ offset, setOffset }}>
                                        <DataInputsContext.Provider value={{ uuid, setUuid }}>
                                            <ButtonContext.Provider value={{ activeBtn, setActiveBtn }}>
                                                <ModalDataInputContext.Provider value={{ inputData, setInputData }}>
                                                    <MoreInfoContext.Provider value={{ moreInfo, setMoreInfo }}>
                                                        <Route exact path="/contact" component={ContactsScreen} />
                                                        <Route exact path="/company" component={CompanyScreen} />
                                                        <Route exact path="/user" component={UserScreen} />
                                                        <Route exact path="/location" component={LocationScreen} />
                                                    </MoreInfoContext.Provider>
                                                </ModalDataInputContext.Provider>
                                            </ButtonContext.Provider>
                                        </DataInputsContext.Provider>
                                    </OffsetContext.Provider>
                                </LimitDataContext.Provider>
                            </DataTableContext.Provider>
                        </CurrentDataManagerContext.Provider>
                    </InfoComponentContext.Provider>
                </DataContext.Provider>
                <Redirect to="/contact" />
            </Switch>
        </>
    )
}

export default AppRouter;