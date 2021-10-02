// Libraries

import React from 'react';

// Styles

import './Checkbox.css';

const Checkbox = () => {
    return (
        <th className="checkbox-container">
            <div className="checkbox-border">
                <input type="checkbox" className="checkbox"/>
            </div>
        </th>
    )
}

export default Checkbox;
