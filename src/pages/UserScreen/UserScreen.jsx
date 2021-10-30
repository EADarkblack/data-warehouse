// Libraries

import React, { useContext, useEffect, useState } from 'react';

// Components

import Button from '../../components/Button/Button';
import DataTable from '../../components/DataTable/DataTable';
import DataManager from '../../components/DataManager/DataManager';
import { AuthContext } from '../../context/AuthContext';
import { authTypes } from '../../types/authTypes';
import { DataContext } from '../../context/DataContext';
import { InfoComponentContext } from '../../context/InfoComponentContext';
import { CurrentDataManagerContext } from '../../context/CurrentDataManagerContext';
import { DataTableContext } from '../../context/DataTableContext';

// Styles

import './UserScreen.css';

// Functions

const UserScreen = () => {

    /**
     * Gets the "dispatch" from  the AuthContext.
     */

    const {dispatch} = useContext(AuthContext);

    /**
     * Saves the data from the user logged to show on the "user screen".
     */

    const [data, setData] = useState({});

    /**
     * saves an array with all users registered on the app.
     */

    const {allData, setAllData} = useContext(DataTableContext);

    /**
     * Gets the user's uuid from the localstorage.
     */

    const id = JSON.parse(localStorage.getItem('user'));

    /**
     * Gets the user's token from the localstorage.
     */
    
    const token = JSON.parse(localStorage.getItem('token'));

    /**
     * Takes from the context the current state for the "Data Manager" component.
     */

    const {closeNode, setCloseNode} = useContext(DataContext);

    /**
     * Takes from the context the data type handler's current state for the "Data Manager".
     */

    const {current, setCurrent} = useContext(CurrentDataManagerContext);

    /**
     * Takes from the context the object's current state that allows show the respective input options on the "Data Manager" component.
     */

    const {infoComponent, setInfoComponent} = useContext(InfoComponentContext);

    /**
     * Gets the user's data from the server searching by his/her uuid.
     */
    
    const getDataUser = async() => {
        const response = await fetch(`http://localhost:4000/v1/user/${id}`, {headers: {
            'Authorization': `Bearer ${token}`
        }});
        const data = await response.json();
        setData(data);
    }
    
    /**
     * Gets all users registered on the app.
     */

    const getAllUsers = async() => {
        const response = await fetch('http://localhost:4000/v1/user', {headers: {
            'Authorization': `Bearer ${token}`
        }});
        const users = await response.json();
        setAllData(users);
    }
    
    /**
     * This hooks allows execute all request avoiding the iteration on there.
     * .
     */
    
    useEffect(() => {
        getDataUser();
        getAllUsers();
    }, []);
    
    /**
     * Assigns a name to the profile boolean value, with this is possible show on the screen the profile status.
     */
    
    const role = data.profile ? "Administrador" : "Básico";
        
    /**
     * An array with all column's titles for the user table.
     */
    
    const columns = [
        {
            title: "Usuario",
            sort: true
        },
        {
            title: "Correo Electrónico",
            sort: false
        },
        {
            title:  "Perfil",
            sort: false
        },
        {
            title: "Acciones",
            sort: false
        }
    ]

    /**
     * Change the log status and deletes all data saved on the localstorage.
     */
    
    const logout = () => {
        dispatch({type: authTypes.logout});
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
    
    /**
     * Allows open the "Data Manager" screen and set its respective data.
     */
    
    const createUser = () => {
        setInfoComponent(createUserObj);
        setCloseNode("data-manager-bg active");
        setCurrent("new");
    }
    
    /**
     * Allows open the "Data Manager" screen on the edit user mode.
     */
    
    const editOwner = () => {
        setInfoComponent(editUserObj);
        setCloseNode("data-manager-bg active");
        setCurrent("edit");
    }

    /**
     * assign some data and function to every button on the user section.
     */
    
    const userSectionButtonsAdmin = [
        {
            class: "add-user-btn",
            text: "Agregar usuario",
            func: createUser
        },
        {
            class: "logout-btn",
            text: "Cerrar sesión",
            func: logout
        }
    ]

    /**
     * Sets the log out button for the user screen on the basic user mode.
     */
    
    const userSectionButtonsBasic = [
        {
            class: "logout-btn",
            text: "Cerrar sesión",
            func: logout
        }
    ]

    /**
     * Validates if the user when is modifying his/her own data is admin or is basic user and blocks the profile editor input. 
     */

    const profileInputHandle = data.profile ? {
        title: "Perfil",
        require: true,
        type: "text",
        name: "profile",
        owner_data: data.profile ? "Administrador" : "Basico",
        disable: false
    } : {
        title: "Perfil",
        require: true,
        type: "text",
        name: "profile",
        owner_data: data.profile ? "Administrador" : "Basico",
        disable: true
    };
    
    /**
     * The object with all data for the "Data Manager" on the user edit mode.
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
            profileInputHandle,
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
     * The object with all data for the "Data Manager" on the user create mode.
     */
    
    const createUserObj = {
        title_component: "Nuevo usuario",
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

    return (
        <>
            <DataManager active={closeNode} info={infoComponent} current={current} token={token}/>
            <div className="user-section-container">
                <div className="title">
                    Bienvenido/a {data.name}
                </div>
                <hr />
                <div className="user-data">
                    <div className="data">
                        <h3>Datos personales:</h3>
                        <div>Nombres y Apellidos: {data.name} {data.last_name}</div>
                        <div>Correo Electrónico: {data.email}</div>
                        <div>Perfil: {role}</div>
                    </div>
                    <div onClick={editOwner} className="edit-user-btn">
                        <i className="fas fa-pen"></i>
                    </div>
                </div>
                <hr />
                <div className="event-btn">
                    {
                        data.profile ? <Button dataBtn={userSectionButtonsAdmin}/> : <Button dataBtn={userSectionButtonsBasic}/>
                    }
                </div>
                <>
                    {

                        data.profile && <DataTable tableClass={"user-table-container"} user={allData} columns={columns} token={token} title_delete={"usuarios"}/>
                    }
                </>
            </div>
        </>
    )
}

export default UserScreen;