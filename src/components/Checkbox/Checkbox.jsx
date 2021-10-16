// Libraries

import React from 'react';

// Styles

import './Checkbox.css';

// Functions

const Checkbox = () => {
    return (
        <div className="checkbox-border">
            <input onClick={() => console.log("seleccionar todo")} type="checkbox" className="checkbox"/>
        </div>
    )
}

export default Checkbox;
