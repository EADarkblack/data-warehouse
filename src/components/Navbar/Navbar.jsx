// Libraries

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

// Styles

import './Navbar.css';

// Functions

const Navbar = ({ auth }) => {

    /**
    * States and Contexts to handle the data.
    */

    const [isActive, setActive] = useState("Contactos");

    /**
     * An array with all data from each button on the nav bar.
     */

    const buttons = [
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
            name: "Usuarios"
        },
        {
            path: "/location",
            name: "Región/Ciudad"
        }
    ];

    /**
     * 
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
                {buttons.map((item) => (
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