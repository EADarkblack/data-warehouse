// Libraries

import React, { useContext, useEffect } from 'react';

// Components

import Button from '../../components/Button/Button';
import DataManager from '../../components/DataManager/DataManager';
import LocationComponent from '../../components/LocationComponent/LocationComponent';
import NoContentComponent from '../../components/NoContentComponent/NoContentComponent';
import { CurrentDataManagerContext } from '../../context/CurrentDataManagerContext';
import { DataContext } from '../../context/DataContext';
import { DataTableContext } from '../../context/DataTableContext';
import { InfoComponentContext } from '../../context/InfoComponentContext';

// Styles

import './LocationScreen.css';

// Functions

const LocationScreen = () => {

    /**
     * Gets the user's token from the localstorage.
     */
    
    const token = JSON.parse(localStorage.getItem('token'));

    /**
     * Takes from the context the object's current state that allows show the respective input options on the "Data Manager" component.
     */

    const {infoComponent, setInfoComponent} = useContext(InfoComponentContext);

    /**
     * Takes from the context the current state for the "Data Manager" component.
     */

    const {setCloseNode} = useContext(DataContext);

    /**
     * saves an array with all users registered on the app.
     */
    
    const {allData, setAllData} = useContext(DataTableContext);

    /**
     * Takes from the context the data type handler's current state for the "Data Manager".
     */

    const {current, setCurrent} = useContext(CurrentDataManagerContext);

    /**
     * An object with all data for the create region modal.
     */
    
    const createRegion = {
        title_component: "Nueva región",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                owner_data: ""
            }
        ],
        pic: false
    }

    /**
     * Allows to create a new region and set all data for the "Data Manager" component.
     */

    const createRegionBtn = () => {
        setCurrent("new-region");
        setInfoComponent(createRegion);
        setCloseNode("data-manager-bg active-modal");
    }

    /**
     * An Array with all data for the buttons on the create region modal.
     */

    const addRegionBtn = [
        {
            class: "add-region-btn",
            text: "Agregar región",
            func: createRegionBtn
        }
    ]
    
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
     * An useEffect hook that allows to get all regions from the database.
     */
    
     useEffect(() => {
        getAllRegions();
    }, []);

    return (
        <>
            <DataManager info={infoComponent} current={current}/>
            <div className="location-section-container">
                <div className="button-container">
                    <Button dataBtn={addRegionBtn}/>
                </div>
                <hr />
                <>
                    {
                        allData.length > 0 ? allData.map((item, index) => {
                            return (
                                <LocationComponent key={index} region={item} token={token}/>
                            )
                        }) : <NoContentComponent />
                    }
                </>
            </div>
        </>
    );
}

export default LocationScreen;