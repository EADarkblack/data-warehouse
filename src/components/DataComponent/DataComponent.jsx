// Libraries

import React, { useContext } from 'react';

// Styles

import './DataComponent.css';

// Components

import Checkbox from '../Checkbox/Checkbox';
import { DataContext } from '../../context/DataContext';
import { InfoComponentContext } from '../../context/InfoComponentContext';
import { CurrentDataManagerContext } from '../../context/CurrentDataManagerContext';
import { DataTableContext } from '../../context/DataTableContext';
import { LimitDataContext } from '../../context/LimitDataContext';

// Functions

const DataComponent = ({data, token, className, checkboxClass}) => {

    /**
     * Takes "profile" and assign a value that can be render on the screen.
     */

    const profile = data.profile ? "Administrador" : "Básico";

    /**
     *  Takes from the context the current state for the "Data Manager" component.
     */

    const {setCloseNode} = useContext(DataContext);

    /**
     * Takes from the context the object's current state that allows show the respective input options on the "Data Manager" component.
     */

    const {setInfoComponent} = useContext(InfoComponentContext);

    /**
     * Takes from the context the data type handler's current state for the "Data Manager".
     */

    const {setCurrent} = useContext(CurrentDataManagerContext);

    /**
     * Sets an updated version of all data from the data base.
     */

    const {setAllData} = useContext(DataTableContext);

    /**
     * 
     */

    const {limit, setLimit} = useContext(LimitDataContext);

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
     * Gets from the database the current version of all data.
     */
    
     const getRequestUser = async() => {
        const response = await fetch('http://localhost:4000/v1/user', {headers: {
            'Authorization': `Bearer ${token}`,
            'Sort': 'ASC',
            'Column': 'id',
            'limit': limit,
            'offset': 0
        }});
        const users = await response.json();
        setAllData(users);
    }

    /**
     * The request options for the data delete request.
     */

    const requestOpt = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    }

    /**
     * The delete request for the data from the data table.
     */

    const deleteData = async() => {
        const {uuid} = data;
        const response = await fetch(`http://localhost:4000/v1/user/${uuid}`, requestOpt);
        const dataRes = await response.json();
        dataRes && getRequestUser();
    }

    /**
     * Allows modify the user selected by the admin user. this func set all data to their respective context.
     */

    const editCurrentUser = () => {
        setCurrent("edit-user");
        setInfoComponent(editUserObj);
        setCloseNode("data-manager-bg active");
    }
    
    return (
        <div className={className}>
            <div className="checkbox-container">
                <Checkbox uuid={data.uuid} checkboxClass={checkboxClass}/>
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
                <i onClick={deleteData} className="fas fa-trash"></i>
                <i onClick={editCurrentUser}  className="fas fa-pen"></i>
            </div>
        </div>
    )
}

export default DataComponent;