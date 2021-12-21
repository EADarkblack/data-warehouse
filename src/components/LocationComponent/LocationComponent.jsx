// Libraries

import React, { useContext, useState } from 'react';

// Components

import { CurrentDataManagerContext } from '../../context/CurrentDataManagerContext';
import { DataContext } from '../../context/DataContext';
import { DataTableContext } from '../../context/DataTableContext';
import { InfoComponentContext } from '../../context/InfoComponentContext';
import CountryComponent from '../CountryComponent/CountryComponent';

// Styles

import './LocationComponent.css';

// Functions

const LocationComponent = ({region, token}) => {

    /**
     * This state allows to deploy the regions and show all data inside the respective region.
     **/

    const [deployRegion, setDeployRegion] = useState(false);

    /**
     * Takes from the context the current state for the "Data Manager" component.
     */

    const {setCloseNode} = useContext(DataContext);

    /**
     * Takes from the context the object's current state that allows show the respective input options on the "Data Manager" component.
     */

    const {setInfoComponent} = useContext(InfoComponentContext);

    /**
     * Takes from the context the data type handler's current state for the "Data Manager".
     */

    const {setCurrent} = useContext(CurrentDataManagerContext);

    /**
     * Sets an updated version of all data from the data base.
     */

    const {setAllData} = useContext(DataTableContext);

    /**
     * An object with all data for the "Data Manager" for every region edit modal.
     */

    const editRegionObj = {
        title_component: "Editar región",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                owner_data: region.name
            }
        ],
        owner: region,
        pic: false
    }
    
    /**
     * An object with all data for the "Data Manager" for the add region modal.
     */
    
     const addCountryObj = {
        title_component: "Nuevo país",
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
        region: region.uuid
    }

    /**
     * A function that allows to set the current data type handler's state for the "Data Manager" to edit mode.
     */

    const editCurrentRegion = () => {
        setCurrent("edit-region");
        setInfoComponent(editRegionObj);
        setCloseNode("data-manager-bg active-modal");
    }
    
    /**
     * A function that allows to set the current data type handler's state for the "Data Manager" to country add mode.
     */

     const addCountry = () => {
        setCurrent("new-country");
        setInfoComponent(addCountryObj);
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

    const deleteRegion = async() => {
        const response = await fetch(`http://localhost:4000/v1/region/${region.uuid}`, requestOpt);
        const dataRes = await response.json();
        dataRes && getAllRegions();
        setDeployRegion(false);
    }

    return (
        <div className="component-container">
            <div className="region-container">
                <div className="deploy-icon">
                    <i className="fas fa-angle-right" onClick={() => setDeployRegion(!deployRegion)}></i>
                </div>
                <div className="region">
                    {region.name}
                </div>
                <div className="region-buttons">
                    <div className="edit-region-btn">
                        <i className="fas fa-pen" onClick={editCurrentRegion} title="Editar"></i>
                    </div>
                    <div className="add-country-btn">
                        <i className="fas fa-plus" onClick={addCountry} title="Agregar país"></i>
                    </div>
                    <div className="delete-region-btn">
                        <i className="fas fa-trash" onClick={deleteRegion} title="Eliminar"></i>
                    </div>
                </div>
            </div>
            <div className={deployRegion ? "result-area" : "result-area no-active"}>
                {
                    region.countries.map((country, index) => {
                        return (
                            <CountryComponent country={country} key={index} token={token} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default LocationComponent;
