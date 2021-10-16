// Libraries

import React, { useContext } from 'react';

// Styles

import './DataComponent.css';

// Components

import Checkbox from '../Checkbox/Checkbox';
import { DataContext } from '../../context/DataContext';
import { InfoComponentContext } from '../../context/InfoComponentContext';
import { CurrentDataManagerContext } from '../../context/CurrentDataManagerContext';

// Functions

const DataComponent = ({data}) => {

    /**
     * Takes "profile" and assign a value that can be render on the screen.
     */

    const profile = data.profile ? "Administrador" : "Básico";

    /**
     *  Takes from the context the current state for the "Data Manager" component.
     */

    const {closeNode, setCloseNode} = useContext(DataContext);

    /**
     * Takes from the context the object's current state that allows show the respective input options on the "Data Manager" component.
     */

    const {infoComponent, setInfoComponent} = useContext(InfoComponentContext);

    /**
     * Takes from the context the data type handler's current state for the "Data Manager".
     */

    const {current, setCurrent} = useContext(CurrentDataManagerContext)

    /**
     *  An object with all data for the "Data Manager" for every user data component.
     */
        
     const editUserObj = {
        title_component: "Editar usuario",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                owner_data: data.name
            },
            {
                title: "Apellido",
                require: false,
                type: "text",
                name: "last_name",
                owner_data: data.last_name || ""
            },
            {
                title: "Correo Electrónico",
                require: true,
                type: "email",
                name: "email",
                owner_data: data.email
            },
            {
                title: "Perfil",
                require: true,
                type: "text",
                name: "profile",
                owner_data: data.profile ? "Administrador" : "Básico",
                disable: false
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
        owner: data,
        pic: false
    }

    /**
     * sopa do macaco
     */

    const a = () => {
        console.log("sopa do macaco")
    }

    /**
     * Allows modify the user selected by the admin user. this func set all data to their respective context.
     */

    const editCurrentUser = () => {
        setCurrent("edit");
        setInfoComponent(editUserObj)
        setCloseNode("data-manager-bg active");
    }
    
    return (
        <div className="data-container">
            <div className="checkbox-container">
                <Checkbox />
            </div>
            <div className="data-box">
                {data.name} {data.last_name}
            </div>
            <div className="data-box">
                {data.email}
            </div>
            <div className="data-box">
                {profile}
            </div>
            <div className="data-box">
                <i className="fas fa-ellipsis-h"></i>
                <i onClick={a} className="fas fa-trash"></i>
                <i onClick={editCurrentUser}  className="fas fa-pen"></i>
            </div>
        </div>
    )
}

export default DataComponent;