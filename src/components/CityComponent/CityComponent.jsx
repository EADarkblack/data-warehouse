// Libraries

import React, { useContext } from 'react';

// Components

import { CurrentDataManagerContext } from '../../context/CurrentDataManagerContext';
import { DataContext } from '../../context/DataContext';
import { DataTableContext } from '../../context/DataTableContext';
import { InfoComponentContext } from '../../context/InfoComponentContext';

// Styles

import './CityComponent.css';

// Functions

const CityComponent = ({ city, token }) => {

    /**
     *  States and Contexts to handle the data.
     */

    const { setCurrent } = useContext(CurrentDataManagerContext);

    const { setInfoComponent } = useContext(InfoComponentContext);

    const { setCloseNode } = useContext(DataContext);

    const { setAllData } = useContext(DataTableContext);

    /**
     * An object with all data for the "Data Manager" for every city data component.
     */

    const editCityObj = {
        title_component: "Editar ciudad",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                value: city.name
            }
        ],
        owner: city,
        pic: false
    }

    /**
     * Allows modify the city selected by the user. this function sets all the contexts.
     */

    const editCurrentCity = () => {
        setCurrent("edit-city");
        setInfoComponent(editCityObj);
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
     * Gets from the database the current version of all data.
     */

    const getAllRegions = async () => {
        const response = await fetch('http://localhost:4000/v1/region', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const regions = await response.json();
        setAllData(regions);
    }

    /**
     * The delete request for the data.
     */

    const deleteCity = async () => {
        const response = await fetch(`http://localhost:4000/v1/city/${city.uuid}`, requestOpt);
        const dataRes = await response.json();
        dataRes && getAllRegions();
    }

    return (
        <div className="city-container-comp">
            <div className="city">
                {city.name}
            </div>
            <div className="city-buttons">
                <div className="edit-city-btn">
                    <i className="fas fa-pen" onClick={editCurrentCity} title="Editar"></i>
                </div>
                <div className="delete-city-btn">
                    <i className="fas fa-trash" onClick={deleteCity} title="Eliminar"></i>
                </div>
            </div>
        </div>
    )
}

export default CityComponent;