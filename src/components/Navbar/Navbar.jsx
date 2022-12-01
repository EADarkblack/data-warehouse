// Libraries

import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';

// Components

import { ChangeProfileContext } from '../../context/ChangeProfileContext';

// Styles

import './Navbar.css';

// Functions

const Navbar = ({ auth }) => {

    /**
    * States and Contexts to handle the data.
    */

    const { profile, setProfile } = useContext(ChangeProfileContext);

    const [isActive, setActive] = useState("Contactos");

    const id = JSON.parse(localStorage.getItem('user'));

    const token = JSON.parse(localStorage.getItem('token'));

    const [type, setType] = useState(false);

    /**
     * Gets the user's data from the server searching by his/her uuid.
     */

    const getDataUser = async () => {
        const response = await fetch(`http://localhost:4000/v1/user/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        data.profile ? setType(true) : setType(false);
    }

    /**
     * Some useEFfects to handle the information in real time // in this case is only for change the navbar
     */

    useEffect(() => {
        getDataUser();
    }, [profile])

    useEffect(() => {
        auth.log === false && setProfile(false);
        setActive("Contactos");
    }, [auth])

    /**
     * This array contains all the information to show at the navbar
     * Type - It's used to change the navbar when the user is admin or basic user
     */

    const button = [
        {
            path: "/contact",
            name: "Contactos"
        },
        {
            path: "/company",
            name: "Compañias"
        },
        {
            path: "/user",
            name: `${type ? "Usuarios" : "Perfil"}`
        },
        {
            path: "/location",
            name: "Región/Ciudad"
        }
    ]

    /**
     * @param {string} name  Refers to the name from the actual button clicked by the user.
     */

    const handleActive = (name) => {
        setActive(name);
    }

    return (
        <nav className="nav-bar-container">
            <NavLink to="/contact" className="anchor-logo" onClick={() => handleActive("Contactos")}>
                <img src="/assets/logo.png" alt="" className="logo" />
            </NavLink>
            <div className={auth.log ? "menu-container" : "menu-container active-menu"}>
                {button.map((item) => (
                    <div onClick={() => handleActive(item.name)} className={isActive === item.name ? "nav-button active" : "nav-button"} key={item.name}>
                        <NavLink to={item.path} className="anchor">
                            {item.name}
                        </NavLink>
                        <div className="underline"></div>
                    </div>
                ))}
            </div>
        </nav>
    )
}

export default Navbar;