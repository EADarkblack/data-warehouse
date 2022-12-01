// Libraries

import React, { useState, useContext } from 'react';

// Components

import { CheckboxContext } from '../../context/CheckboxContext';
import { ConfirmationNodeContext } from '../../context/ConfirmationNodeContext';
import { DataTableContext } from '../../context/DataTableContext';
import { LimitDataContext } from '../../context/LimitDataContext';
import { OffsetContext } from '../../context/OffsetContext';
import Checkbox from '../Checkbox/Checkbox';
import ConfirmationNode from '../ConfirmationNode/ConfirmationNode';
import DataComponent from '../DataComponent/DataComponent';

// Styles

import './DataTable.css';

// Functions

const DataTable = ({ user, columns, tableClass, token, title_delete, totalResults }) => {

    /**
     * States and contexts to handle the data.
     */

    const [checkboxData, setCheckboxData] = useState([]);

    const [confirmationNode, setConfirmationNode] = useState("node-bg no-active-node");

    const { limit, setLimit } = useContext(LimitDataContext);

    const { allData } = useContext(DataTableContext);

    const { offset, setOffset } = useContext(OffsetContext);

    /**
     * A function that allows to close the confirmation modal.
     */

    const deleteSelectedData = () => {
        setConfirmationNode("node-bg");
    }

    return (
        <CheckboxContext.Provider value={{ checkboxData, setCheckboxData }}>
            <ConfirmationNodeContext.Provider value={{ confirmationNode, setConfirmationNode }}>
                <ConfirmationNode token={token} page={title_delete} />
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
                                <Checkbox data={user} checkboxClass={checkboxData.length !== 0 ? 'checkbox-border block' : 'checkbox-border'} />
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
                                } checkboxClass={checkboxData.find(value => value === item.uuid) ? "checkbox-border active" : "checkbox-border"} page={title_delete} />
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
                                <i className={offset === 0 ? "fas fa-chevron-left no-active-btn" : "fas fa-chevron-left"} onClick={() => {
                                    setOffset(Math.sign(offset - limit) === -1 ? 0 : offset - limit);
                                }}></i>
                                <i className={allData.length < offset ? "fas fa-chevron-right no-active-btn" : "fas fa-chevron-right"} onClick={() => {
                                    if (allData.length !== 0) {
                                        setOffset(allData.length < totalResults ? offset + limit : limit - offset);
                                    }
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