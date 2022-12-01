// Libraries

import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

// Components

import { DataInputsContext } from '../../context/DataInputsContext';
import { ModalDataInputContext } from '../../context/ModalDataInputContext';

// Functions

const Select = ({ data }) => {

    /**
     *  States and Contexts to handle the data.
     */

    const { uuid, setUuid } = useContext(DataInputsContext);

    const { inputData, setInputData } = useContext(ModalDataInputContext);

    /**
     * useEffect - It's used to clear the location's inputs when the region hasn't a valid value.
     */

    useEffect(() => {
        uuid.region === "" && setUuid({});
    }, [uuid])

    return (
        <label className="data-input">
            <p className="title-input">{data.title}<span>{data.require ? "*" : ""}</span></p>
            <select className="pag-select" disabled={data.option && data.option.length > 0 ? false : true} onChange={(e) => {
                setUuid({
                    ...uuid,
                    [data.name]: e.target.value
                })
                setInputData({
                    ...inputData,
                    [data.name]: e.target.value
                })
            }}>
                {
                    data.option.map((item, i) => {
                        return (
                            <option value={item.value} key={i}>{item.name}</option>
                        )
                    })
                }
            </select>
        </label>
    )
}

// Props

Select.propTypes = {
    data: PropTypes.object
}

export default Select;