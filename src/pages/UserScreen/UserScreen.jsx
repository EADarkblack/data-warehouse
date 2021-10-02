// Libraries

import React, { useContext, useEffect, useState } from 'react';

// Components

import Button from '../../components/Button/Button';
import DataTable from '../../components/DataTable/DataTable';
import { AuthContext } from '../../context/AuthContext';
import { authTypes } from '../../types/authTypes';

// Styles

import './UserScreen.css'

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

    const [users, setUsers] = useState([]);

    /**
     * Gets the user's uuid from the localstorage.
     */

    const id = JSON.parse(localStorage.getItem('user'));

    /**
     * Gets the user's token from the localstorage.
     */

    const token = JSON.parse(localStorage.getItem('token'));

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
        setUsers(users);
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

    const role = data.profile ? "administrador" : "Básico";
    
    
    /**
     * An array with all column's titles for the user table.
     */
    
    const columns = [
        "Usuario",
        "Correo Electrónico",
        "Perfil",
        "Acciones"
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
     * assign some data and function to every button on the user section.
     */

    const userSectionButtons = [
        {
            class: "add-user-btn",
            text: "Agregar usuario"
        },
        {
            class: "logout-btn",
            text: "Cerrar sesión",
            func: logout
        }
    ]

    return (
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
                <div onClick={() => console.log("holi caracoli")} className="edit-user-btn">
                    <i className="fas fa-pen"></i>
                </div>
            </div>
            <hr />
            <div className="event-btn">
                <Button dataBtn={userSectionButtons}/>
            </div>
            <>
                <DataTable tableClass={"user-table-container"} user={users} columns={columns}/>
            </>
        </div>
    )
}

export default UserScreen;