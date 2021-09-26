// Libraries

import React, {useState} from 'react';
import { NavLink, BrowserRouter as Router } from 'react-router-dom';

// Styles

import './Navbar.css';

// Functions

const Navbar = () => {

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
     * This state allows add to the button the class name "active".
     */

    const [isActive, setActive] = useState("Contactos");

    /**
     * 
     * @param {string} name  Refers to the name from the actual button clicked by the user.
     */

    const handleActive = (name) => {
        setActive(name);
    }

    return (
        <Router>
        <nav className="nav-bar-container">
            <NavLink to="/contact" className="anchor-logo" onClick={()=> handleActive("Contactos")}>
                <img src="/assets/logo.png" alt="" className="logo"/>
            </NavLink>
            <div className="menu-container">
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
        </Router>
    )
}

export default Navbar;