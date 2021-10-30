// Libraries

import React, { useContext, useState } from 'react';

// Components

import { AuthContext } from '../../context/AuthContext';
import { DataContext } from '../../context/DataContext';
import { DataTableContext } from '../../context/DataTableContext';
import { authTypes } from '../../types/authTypes';
import Button from '../Button/Button';

// Styles

import './DataManager.css';

// Functions

const DataManager = ({info, current, token}) => {

    /**
     * Gets the "dispatch" from  the AuthContext.
     */

     const {dispatch} = useContext(AuthContext);
    
    /**
     * Takes from the context the current state for the "Data Manager" component.
     */
    
    const {closeNode, setCloseNode} = useContext(DataContext);

    /**
     * Allows set to every input a value, with this is possible save the data typed by the user to later send to the server.
     */

    const [inputData, setInputData] = useState({});

    /**
     * Sets an updated version of all data from the data base.
     */
    
    const {setAllData} = useContext(DataTableContext);

    /**
     * Allows close the "Data Manager" window on the app.
     */
    
    const closeNodeFunc = () => {
        setCloseNode("data-manager-bg");
        setInputData({});
        setErrorMsg("");
        setError(false);
    }

    /**
     * When the user start to typing on every input the button change its color and set every data typed by the user on the inputData state.
     */
    
    const changeBtnColor = (e) => {
        e.target.value.length > 0 ? setActiveBtn(btnConfig.btn_active) : setActiveBtn(btnConfig.btn);
        setInputData({
            ...inputData,
            [e.target.name]: e.target.value
        })
    }

    /**
     * This state allows set a personalized error message for the "Data Manager".
     */

    const [errorMsg, setErrorMsg] = useState("");

    /**
     * An state that allows show or hidde the error message from the screen.
     */

    const [error, setError] = useState(false);
    
    /**
     * Gets from the database the current version of all data.
     */
    
    const getRequestUser = async() => {
        const response = await fetch('http://localhost:4000/v1/user', {headers: {
            'Authorization': `Bearer ${token}`
        }});
        const users = await response.json();
        setAllData(users);
    }
    
    /**
     * Creates a new user when the admin user execute the create user button, this function gets all data from the inputs and later send all that data to the server. when the user is created successfully the "Data Manager" automatically close.
     */

    const createNewUserFunc = async() => {
        const {name, last_name, email, profile, password, confirm_password} = inputData;
        let profileBool = null;
        if (profile === 'Administrador') {
            profileBool = true;
        } else if (profile === 'Básico') {
            profileBool = false;
        } else {
            setErrorMsg("Dato inválido: el perfil solo puede ser Administrador o Básico.");
            setError(true);
        }
        if (password === confirm_password) {
            const optionRequest = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },        
                body: JSON.stringify({
                    name: name,
                    last_name: last_name,
                    email: email,
                    profile: profileBool,
                    password: password
                })
            }
            const response = await fetch('http://localhost:4000/v1/user/register', optionRequest);
            const newUser = await response.json();
            if (newUser.error) {             
                setErrorMsg("El formato de correo electrónico es inválido.");
                setError(true);
            } else {
                setInputData({});
                setCloseNode("data-manager-bg");
                getRequestUser();
            }
        } else {
            setErrorMsg("Las contraseñas no son iguales.");
            setError(true);
        }
    }
       
    /**
     * Allows edit an existing user on the database by his/her uuid, when the user is edited succesffully the same action from the create user function is execute with the only difference in this function the user is automatically logout from the app.
     */

    const editOwner = async() => {
        const {uuid} = info.owner;
        const {name, last_name, email, profile, password, confirm_password} = inputData;
        let profileBool = null;
        if (profile === 'Administrador') {
            profileBool = true;
        } else if (profile === 'Básico') {
            profileBool = false;
        } else {
            profileBool = info.owner.profile
        }
        if (password === confirm_password) {      
            const optionRequest = {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },        
                body: JSON.stringify({
                    name: name,
                    last_name: last_name,
                    email: email || info.owner.email,
                    profile: profileBool,
                    password: password
                })
            }
            const response = await fetch(`http://localhost:4000/v1/user/${uuid}`, optionRequest);
            const data = await response.json();
            if (data.error) {
                setErrorMsg("Dato inválido.");
                setError(true);
            } else {
                setInputData({});
                dispatch({type: authTypes.logout});
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        } else {
            setErrorMsg("Las contraseñas no son iguales.");
            setError(true);
        }
    }

    /**
     * This function allows modify the data from an user selected by the admin on the table.
     */

     const editUser = async() => {
        const {uuid} = info.owner;
        const {name, last_name, email, profile, password, confirm_password} = inputData;
        let profileBool = null;
        if (profile === 'Administrador') {
            profileBool = true;
        } else if (profile === 'Básico') {
            profileBool = false;
        } else {
            profileBool = info.owner.profile
        }
        if (password === confirm_password) {      
            const optionRequest = {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },        
                body: JSON.stringify({
                    name: name,
                    last_name: last_name,
                    email: email || info.owner.email,
                    profile: profileBool,
                    password: password
                })
            }
            const response = await fetch(`http://localhost:4000/v1/user/${uuid}`, optionRequest);
            const data = await response.json();
            if (data.error) {
                setErrorMsg("Dato inválido.");
                setError(true);
            } else {
                setInputData({});
                setCloseNode("data-manager-bg");
                getRequestUser();
            }
        } else {
            setErrorMsg("Las contraseñas no son iguales.");
            setError(true);
        }
    }

    /**
     * This function allows execute the respective function or request on the "Data Manager" and this execution depends from which it the page that is execute this function.
     */

    const handleFunctions = () => {
        if (current === "new") {
            createNewUserFunc();
        } else if (current === "edit") {
            editOwner();
        } else if (current === "edit-user") {
            editUser();
        } else {
            console.log("kk")
        }
    }

    /**
     * An object with every data for the button component. (Includes the function for every button.)
     */
    
    const btnConfig = {
        btn_active: 
        [
            {
                class: "cancel cancel-active",
                text: "Cancelar",
                func: closeNodeFunc
            },
            {
                class: "save-user active-save",
                text: "Guardar cambios",
                func: handleFunctions
            }
        ],
    btn: 
        [
            {
                class: "cancel",
                text: "Cancelar"
            },
            {
                class: "save-user",
                text: "Guardar cambios"
            }
        ]
    }
    
    /**
     * when the user start to typing on the inputs this state allows the color change for the button.
     */
    
    const [activeBtn, setActiveBtn] = useState(btnConfig.btn);

    return (
        <div className={closeNode}>
            <div className="data-manager-container">
                <div className="color-area">
                    <div className="blue-area-content">
                        <h3 className="title">{info.title_component}</h3>
                        <i onClick={closeNodeFunc} className="fas fa-times"></i>
                    </div>
                </div>
                <div className="data-section">
                    <div className={info.pic ? "profile-pic" : ""}>
                        <div className="upload-icon">
                            <div className="blue-area">
                                <i className="fas fa-camera"></i>
                            </div>
                        </div>
                    </div>
                   {
                        info.data_fields.map ((item) => (
                            <label className="data-input" key={item.title}>
                                <div className="title-input">{item.title}<span>{item.require ? "*" : ""}</span></div>
                                <div className="input-container no-active">
                                    <input onChange={changeBtnColor} className="input" type={item.type} name={item.name} placeholder={info.title_component === "Editar usuario" ? item.owner_data : ""} disabled={item.disable}/>
                                </div>
                            </label>
                        ))
                    }
                </div>
                <div className={error ? "error-msg active-msg" : "error-msg"}>{errorMsg}</div>
                <div className="btn-container">
                    <Button dataBtn={activeBtn}/>
                </div>
            </div>
        </div>
    )
}

export default DataManager;