// Libraries

import React, { useState } from 'react';
import { CheckboxContext } from '../../context/CheckboxContext';

// Components

import Checkbox from '../Checkbox/Checkbox';
import DataComponent from '../DataComponent/DataComponent';

// Styles

import './DataTable.css';

// Functions

const DataTable = ({user, columns, tableClass, token, title_delete}) => {
    
    /**
     * @description - Sets the current data getted from the checkbox and allows make few actions with it.
     */

    const [checkboxData, setCheckboxData] = useState([]);

    return (
        <CheckboxContext.Provider value={{checkboxData, setCheckboxData}}>
            <div className={tableClass}>
                <div className={checkboxData.length > 0 ? "select-opt" : "select-opt hide-opt"}>
                    <div className="select-total">{checkboxData.length} seleccionados</div>
                    <div className="delete-container">
                        <i className="fas fa-trash"></i>
                        <div>Eliminar {title_delete}</div>
                    </div>
                </div>
                <div className="table-border">
                    <div className="title-row">
                        <div className="checkbox-container">
                            <Checkbox data={user}/>
                        </div>
                        {
                            columns.map((item) => (
                                <div className="title-column" key={item.title}>
                                    {item.title}
                                    <i className={item.sort ? "fas fa-sort" : ""}></i>
                                </div>
                            ))
                        }
                    </div>
                    {
                        user.map((item) => (
                            <DataComponent data={item} key={item.uuid} token={token} className={
                                checkboxData.find(value => value === item.uuid) ? "data-container active-container" : "data-container"
                            }/>
                        ))
                    }
                </div>
                <div className="pag-menu">
                    <label className="pag-controller">
                        <p>Filas por página</p>
                        <select className="pag-select">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                        <i className="fas fa-chevron-down"></i>
                    </label>
                    <div className="pag-number">
                        <p>1-10 de 30 filas</p>
                        <div className="arrows">
                            <i className="fas fa-chevron-left"></i>
                            <i className="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </CheckboxContext.Provider>
    )
}

export default DataTable;