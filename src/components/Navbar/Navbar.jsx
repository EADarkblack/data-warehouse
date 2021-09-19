// Libraries

import React, {useState} from 'react';
import { NavLink, Switch, Route, BrowserRouter as Router } from 'react-router-dom';

// Styles

import './Navbar.css';

// Components

import ContactsScreen from '../../pages/ContactsScreen';
import CompanyScreen from '../../pages/CompanyScreen';
import UserScreen from '../../pages/UserScreen';
import LocationScreen from '../../pages/LocationScreen';

// Functions

const Navbar = () => {
    const buttons = [
        {
            path: "/",
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

    const [isActive, setActive] = useState("Contactos");

    const handleActive = (name) => {
        setActive(name);
    }

    return (
        <Router>
        <nav className="nav-bar-container">
            <NavLink to="/" className="anchor-logo" onClick={()=> handleActive("Contactos")}>
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
            <Switch>
                <Route exact path="/" component={ContactsScreen} />
                <Route exact path="/company" component={CompanyScreen} />
                <Route exact path="/user" component={UserScreen} />
                <Route exact path="/location" component={LocationScreen} />
            </Switch>
        </Router>
    )
}

export default Navbar
