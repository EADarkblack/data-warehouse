// Libraries

import React, { useState, useContext } from 'react';

// Components

import { CurrentDataManagerContext } from '../../context/CurrentDataManagerContext';
import { DataContext } from '../../context/DataContext';
import { DataTableContext } from '../../context/DataTableContext';
import { InfoComponentContext } from '../../context/InfoComponentContext';
import CityComponent from '../CityComponent/CityComponent';

// Styles

import './CountryComponent.css';

// Functions

const CountryComponent = ({country, token}) => {
    
    /**
     * This state allows to deploy the cities of the country.
     */

    const [deployCountry, setDeployCountry] = useState(false);

    /**
     * Takes from the context the data type handler's current state for the "Data Manager".
     */

    const {setCurrent} = useContext(CurrentDataManagerContext);

    /**
     * Takes from the context the object's current state that allows show the respective input options on the "Data Manager" component.
     */

    const {setInfoComponent} = useContext(InfoComponentContext);

    /**
     * Takes from the context the current state for the "Data Manager" component.
     */
    
    const {setCloseNode} = useContext(DataContext);

    /**
     * Sets an updated version of all data from the data base.
     */

    const {setAllData} = useContext(DataTableContext);

    /**
     * An object with all data for the "Data Manager" for every country edit modal.
     */

     const editCountryObj = {
        title_component: "Editar país",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                owner_data: country.name
            }
        ],
        owner: country,
        pic: false
    }
        
    /**
     * An object with all data for the "Data Manager" for the add city modal.
     */
    
     const addCityObj = {
        title_component: "Nueva ciudad",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                owner_data: ""
            }
        ],
        pic: false,
        country: country.uuid
    }
    
    /**
     * A function that allows to set the current data type handler's state for the "Data Manager" to edit mode.
     */

     const editCurrentCountry = () => {
        setCurrent("edit-country");
        setInfoComponent(editCountryObj);
        setCloseNode("data-manager-bg active-modal");
    }
        
    /**
     * A function that allows to set the current data type handler's state for the "Data Manager" to city add mode.
     */

     const addCity = () => {
        setCurrent("new-city");
        setInfoComponent(addCityObj);
        setCloseNode("data-manager-bg active-modal");
    }
        
    /**
     * The request options for the data delete request.
     */

    const requestOpt = {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    }
        
    /**
     * Gets from the database the current version of all regions.
     */

    const getAllRegions = async() => {
        const response = await fetch('http://localhost:4000/v1/region', {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        const regions = await response.json();
        setAllData(regions);
    }

    /**
     * The delete request for the data from the data table.
     */

    const deleteCountry = async() => {
        const response = await fetch(`http://localhost:4000/v1/country/${country.uuid}`, requestOpt);
        const dataRes = await response.json();
        dataRes && getAllRegions();
        setDeployCountry(false);
    }

    return (
        <div className="country-component">
            <div className="country-container-comp">
                <div className="deploy-icon">
                    <i className="fas fa-angle-right" onClick={() => setDeployCountry(!deployCountry)}></i>
                </div>
                <div className="country">
                    {country.name}
                </div>
                <div className="country-buttons">
                    <div className="edit-country-btn">
                        <i className="fas fa-pen" onClick={editCurrentCountry} title="Editar"></i>
                    </div>
                    <div className="add-city-btn">
                        <i className="fas fa-plus" onClick={addCity} title="Agregar ciudad"></i>
                    </div>
                    <div className="delete-country-btn">
                        <i className="fas fa-trash" onClick={deleteCountry} title="Eliminar"></i>
                    </div>
                </div>
            </div>
            <div className={deployCountry ? "result-area-country" : "result-area-country no-active"}>
                {
                    country.cities.map((city, index) => {
                        return (
                            <CityComponent city={city} key={index} token={token}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default CountryComponent;
