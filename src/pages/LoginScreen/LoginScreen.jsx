// Libraries

import React, { useState, useContext} from 'react';
import { useHistory } from 'react-router-dom';

// Components

import { AuthContext } from '../../context/AuthContext';
import { authTypes } from '../../types/authTypes';

// Styles

import './LoginScreen.css';

// Functions

const LoginScreen = () => {

    /**
     * gets from the reducer the dispatch.
     */

    const {dispatch} = useContext(AuthContext);

    /**
     * allows use the history hook that will allow modify the path when the user is logged.
     */

    const history = useHistory();

    /**
     * An array with all data from each input field from the login.
     */

    const input = [
        {
            type: "email",
            placeholder: "Correo Electrónico"
        },
        {
            type: "password",
            placeholder: "Contraseña"
        }
    ]

    /**
     * An state that allows take from both input fields its respective data.
     */

    const [login, setLogin] = useState({email: "", password: ""})

    /**
     * 
     * @param {{object}} e All events and data from the input elements.
     * This function allows set the new state with every data get from each input field.
     */

    const getData = (e) => {
        setLogin(
            {
                ...login,
                [e.target.name] : e.target.value
            }
        );
    }

    /**
     * An object with all data to send with the http request to the server.
     */

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            email: login.email,
            password: login.password
        })
    }

    /**
     * When the user click to the login button send a request http to the server, once responded the data, change on the reducer the login status and redirect automatically the user to the main section and finally saves on the localstorage the user's token.
     */
    
    const sendToDb = async() => {
        const response = await fetch('http://localhost:4000/v1/user/login', requestOptions);
        const data = await response.json();
        if (data.data) {
            dispatch({type: authTypes.login});
            history.push("/");
            localStorage.setItem('token', JSON.stringify(data.token));
            localStorage.setItem('user', JSON.stringify(data.data.uuid));
        } else {
            setError(false);
        }
    }

    /**
     * When the user don't exists change the state to true, this allows render on the screen an error message.
     */

    const [error, setError] = useState(true);

    return (
        <div className="login-screen">
            <div className="login-container">
                <div className="login-text">Bienvenido/a</div>
                {input.map((item) => (
                    <label className="input-container" key={item.type}>
                        <input type={item.type} onChange={getData} className="login-input" placeholder={item.placeholder} name={item.type}/>
                    </label>
                ))}
                <div className={error ? "error-msg" : "error-msg active-msg"}>Credenciales Incorrectas.</div>
                <hr />
                <button onClick={sendToDb} className="submit-btn">INGRESAR</button>
            </div>
        </div>   
    )
}

export default LoginScreen;