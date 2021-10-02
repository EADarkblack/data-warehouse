// Libraries

import React from 'react'

// Components

import Checkbox from '../Checkbox/Checkbox';
import DataComponent from '../DataComponent/DataComponent';

// Styles

import './DataTable.css';

// Functions

const DataTable = ({user, columns, tableClass}) => {
    return (
        <div className={tableClass}>
            <table className="table-border">
                <tbody>
                    <tr className="title-row">
                        <Checkbox />
                        {
                            columns.map((title) => (
                                <th key={title}>
                                    {title}

                                </th>
                            ))
                        }
                    </tr>
                    {
                        user.map((item) => (
                            <DataComponent data={item} key={item.uuid}/>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default DataTable;