// Libraries

import React, {useContext, useEffect, useState} from 'react';
import { CheckboxContext } from '../../context/CheckboxContext';
import { ConfirmationNodeContext } from '../../context/ConfirmationNodeContext';
import { DataTableContext } from '../../context/DataTableContext';
import Button from '../Button/Button';

// Styles

import './ConfirmationNode.css';

const ConfirmationNode = ({token}) => {

    /**
     * 
     */

    const {confirmationNode, setConfirmationNode} = useContext(ConfirmationNodeContext);

    /**
     * 
     */

    const {checkboxData, setCheckboxData} = useContext(CheckboxContext);

    /**
     * 
     */

    const {allData, setAllData} = useContext(DataTableContext);

    /**
     * 
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
            'Column': 'id'
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
     * 
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
     * 
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
