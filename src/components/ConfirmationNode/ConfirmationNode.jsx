// Libraries

import React, {useContext} from 'react';

// Components

import { CheckboxContext } from '../../context/CheckboxContext';
import { ConfirmationNodeContext } from '../../context/ConfirmationNodeContext';
import { DataTableContext } from '../../context/DataTableContext';
import Button from '../Button/Button';

// Styles

import './ConfirmationNode.css';

// Functions

const ConfirmationNode = ({token}) => {

    /**
     * Allows to show the confirmation modal
     */

    const {confirmationNode, setConfirmationNode} = useContext(ConfirmationNodeContext);

    /**
     * Gets all data from checkbox context.
     */

    const {checkboxData, setCheckboxData} = useContext(CheckboxContext);

    /**
     * Sets an updated version of all data from the data base.
     */

    const {setAllData} = useContext(DataTableContext);

    /**
     * A function that allows to close the confirmation modal.
     */

    const cancelBtn = () => {
        setConfirmationNode("node-bg no-active-node");
    }

    /**
     * Gets from the database the current version of all data.
     */

     const getRequestUser = async() => {
        const response = await fetch('http://localhost:4000/v1/user', {headers: {
            'Authorization': `Bearer ${token}`,
            'Sort': 'ASC',
            'Column': 'id',
            'limit': 1000,
            'offset': 0
        }});
        const users = await response.json();
        setAllData(users);
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
     * This function allows to delete all the data selected from the data table.
     */

    const deleteBtn = () => {
        checkboxData.forEach(async(item) => {
            const response = await fetch(`http://localhost:4000/v1/user/${item}`, requestOpt);
            const dataRes = await response.json();
            dataRes && getRequestUser();
            setCheckboxData([]);
            setConfirmationNode("node-bg no-active-node");
        });
    }

    /**
     * An object with all the data to be displayed on the buttons of the confirmation modal.
     */

    const actionBtn = [
        {
            class: "cancel-btn",
            text: "Cancelar",
            func: cancelBtn    
        },
        {
            class: "delete-btn",
            text: "Eliminar",
            func: deleteBtn
        }
    ]

    return (
        <div className={confirmationNode}>
            <div className="node-container">
                <div className="confirmation-icon">
                    <img src='assets/delete-friend.png' alt="" className="delete-icon"/>
                </div>
                <div className="confirmation-text">
                    <p>¿Seguro que deseas eliminar los contactos seleccionados?</p>
                </div>
                <div className="confirmation-btn">
                    <Button dataBtn={actionBtn}/>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationNode;
