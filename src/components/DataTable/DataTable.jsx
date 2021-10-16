// Libraries

import React from 'react';

// Components

import Checkbox from '../Checkbox/Checkbox';
import DataComponent from '../DataComponent/DataComponent';

// Styles

import './DataTable.css';

// Functions

const DataTable = ({user, columns, tableClass}) => {
    return (
        <div className={tableClass}>
            <div className="table-border">
                <div className="title-row">
                    <div className="checkbox-container">
                        <Checkbox/>
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
                        <DataComponent data={item} key={item.uuid}/>
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
    )
}

export default DataTable;