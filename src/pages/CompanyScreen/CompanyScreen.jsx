// Libraries

import React, { useContext } from 'react';

// Components

import Button from '../../components/Button/Button';
import DataManager from '../../components/DataManager/DataManager';
import DataTable from '../../components/DataTable/DataTable';
import { CurrentDataManagerContext } from '../../context/CurrentDataManagerContext';
import { InfoComponentContext } from '../../context/InfoComponentContext';

// Styles

import './CompanyScreen.css';

// Functions

const CompanyScreen = () => {

    /**
     * 
     */

    const {current, setCurrent} = useContext(CurrentDataManagerContext);

    /**
     * 
     */

    const {infoComponent, setInfoComponet} = useContext(InfoComponentContext);
    
    /**
     * Gets the user's token from the localstorage.
     */
    
     const token = JSON.parse(localStorage.getItem('token'));
        
    /**
     *
     */
    
     const addCompanyObj = {
        title_component: "Nueva compañia",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                owner_data: ""
            },
            {
                title: "Correo Electrónico",
                require: true,
                type: "email",
                name: "email",
                owner_data: ""
            },
            {
                title: "Telefono",
                require: true,
                type: "text",
                name: "phone",
                owner_data: ""
            }
        ],
        pic: false
    }

    /**
     * 
     */
    
     const addCompanyBtn = [
        {
            class: "add-company-btn",
            text: "Agregar compañía",
            func: () => {
                console.log("Agregar compañía");
            }
        }
    ]

    return (
        <>
            <DataManager info={infoComponent} current={current} token={token}/>
            <div className="company-section-container">
                <div className="company-title-container">
                    <div className="company-title">
                        Compañias
                    </div>
                    <div className="company-btn-container">
                        <Button dataBtn={addCompanyBtn}/>
                    </div>
                </div>
                <hr />
{/*                 <>
                    <DataTable />
                </> */}
            </div>
        </>
    )
}

export default CompanyScreen;
