// Libraries

import React, { useState, useContext, useEffect } from 'react';

// Components

import { CheckboxContext } from '../../context/CheckboxContext';
import { ConfirmationNodeContext } from '../../context/ConfirmationNodeContext';
import { DataTableContext } from '../../context/DataTableContext';
import { LimitDataContext } from '../../context/LimitDataContext';
import Checkbox from '../Checkbox/Checkbox';
import ConfirmationNode from '../ConfirmationNode/ConfirmationNode';
import DataComponent from '../DataComponent/DataComponent';

// Styles

import './DataTable.css';

// Functions

const DataTable = ({user, columns, tableClass, token, title_delete, totalResults}) => {

    /**
     * @description - Sets the current data getted from the checkbox and allows make few actions with it.
     */

    const [checkboxData, setCheckboxData] = useState([]);

    /**
     * 
     */
  
    const [confirmationNode, setConfirmationNode] = useState("node-bg no-active-node");

    /**
     * 
     */

    const {limit, setLimit} = useContext(LimitDataContext);

    /**
     * 
     */

    const {allData} = useContext(DataTableContext);

    /**
     * 
     */

    let [offset, setOffset] = useState(0);

    /**
     * 
     */

    const deleteSelectedData = () => {
        setConfirmationNode("node-bg");
    }

    /**
     * 
     */

    const a = (text) => {
        console.log(`${text} pana miguel!!!`);
        console.log(offset);
    }

    return (
        <CheckboxContext.Provider value={{checkboxData, setCheckboxData}}>
        <ConfirmationNodeContext.Provider value={{confirmationNode, setConfirmationNode}}>
            <ConfirmationNode token={token}/>
            <div className={tableClass}>
                <div className={checkboxData.length > 0 ? "select-opt" : "select-opt hide-opt"}>
                    <div className="select-total">{checkboxData.length} seleccionados</div>
                    <div className="delete-container" onClick={deleteSelectedData}>
                        <i className="fas fa-trash"></i>
                        <div>Eliminar {title_delete}</div>
                    </div>
                </div>
                <div className="table-border">
                    <div className="title-row">
                        <div className="checkbox-container">
                            <Checkbox data={user} checkboxClass={checkboxData.length != 0 ? 'checkbox-border block' : 'checkbox-border'}/>
                        </div>
                        {
                            columns.map((item) => (
                                <div className="title-column" key={item.title}>
                                    {item.title}
                                    <i className={item.sort ? "fas fa-sort" : ""} onClick={item.func}></i>
                                </div>
                            ))
                        }
                    </div>
                    {
                        user.map((item) => (
                            <DataComponent data={item} key={item.uuid} token={token} className={
                                checkboxData.find(value => value === item.uuid) ? "data-container active-container" : "data-container"
                            } checkboxClass={checkboxData.find(value => value === item.uuid) ? "checkbox-border active" : "checkbox-border"}/>
                        ))
                    }
                </div>
                <div className="pag-menu">
                    <label className="pag-controller">
                        <p>Filas por página</p>
                        <select className="pag-select" onChange={(e) => setLimit(parseInt(e.target.value))}>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                    </label>
                    <div className="pag-number">
                        <p>1 - {allData.length} de {totalResults} filas</p>
                        <div className="arrows">
                            <i className="fas fa-chevron-left"  onClick={() =>  {
                                setOffset(offset === 0 ? 0 : offset - limit);
                                a("Adios");
                            }}></i>
                            <i className="fas fa-chevron-right" onClick={() => {
                                setOffset(totalResults < offset ? offset + limit : limit);
                                a("Hola");
                            }}></i>
                        </div>
                    </div>
                </div>
            </div>
        </ConfirmationNodeContext.Provider>
        </CheckboxContext.Provider>
    )
}

export default DataTable;