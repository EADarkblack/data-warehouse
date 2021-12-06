// Libraries

import React, { useContext, useState } from 'react';

// Components 

import { CheckboxContext } from '../../context/CheckboxContext';

// Styles

import './Checkbox.css';

// Functions

const Checkbox = ({uuid, data, checkboxClass}) => {

    /**
     * Gets all data from checkbox context.
     */

    const {checkboxData, setCheckboxData} = useContext(CheckboxContext);

    /**
     * This array is used to store the data of the checkbox.
     */

    const [dataArr, setDataArr] = useState([]);

    /**
     * Delete from array the data already existing on the array. This function allows the change of the data component style.
     */

    const deleteSameId = () => {
        const i = checkboxData.map(item => item).indexOf(uuid);
        i !== -1 && checkboxData.splice(i, 1);
        setCheckboxData([
            ...checkboxData
        ]);
    }

    /**
     * When the user sends a same uuid to the array, it will be removed or if this uuid no exist on the array it will be added.
     */

    const validateExistData = () => {
        checkboxData.find(value => value === uuid) ? deleteSameId() : setCheckboxData([
            ...checkboxData,
            uuid
        ]);
    }

    /**
     * This function allows select and unselect all data on the data table.
     */

    const selectAll = () => {
        data.forEach(({uuid}) => {
            if (checkboxData.find(value => value === uuid)) {
                setDataArr([]);
                setCheckboxData([]);
            } else {           
                dataArr.push(uuid);       
                setCheckboxData(dataArr);
            }
        }) 
    }

    /**
     * Validate the checkbox type and execute its respective function.
     */

    const handleCheckbox = () => {
        if (uuid) {
            validateExistData();
        } else {
            selectAll();
        }
    }

    return (
        <div className={checkboxClass}>
            <div className="icon">
                <i className={checkboxClass === 'checkbox-border active' ? 'fas fa-check' : 'fas fa-minus'}></i>
            </div>
            <input onClick={handleCheckbox} type="checkbox" className="checkbox"/>
        </div>
    )
}

export default Checkbox;
