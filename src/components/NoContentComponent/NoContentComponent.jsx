// Libraries

import React from 'react';

// Styles

import './NoContentComponent.css';

// Functions

const NoContentComponent = () => {
    return (
        <div className="no-content-container">
            <div className="no-content">
                <div className="no-content-icon">
                    <img src="assets/document.png" alt="" className="icon" />
                </div>
                <div className="no-content-title">
                    <h1>No hay regiones para mostrar</h1>
                </div>
            </div>
        </div>
    )
}

export default NoContentComponent;