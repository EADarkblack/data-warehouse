// Dependencies

import React, { useEffect, useContext } from 'react';

// Components

import Button from '../Button/Button';
import { LimitDataContext } from '../../context/LimitDataContext';
import { DataTableContext } from '../../context/DataTableContext';
import { QueryContext } from '../../context/QueryContext';

// Style

import './SearchInputComponent.css';

// Functions

const SearchInputComponent = () => {

    const token = JSON.parse(localStorage.getItem('token'));

    const { limit } = useContext(LimitDataContext);

    const { setAllData } = useContext(DataTableContext);

    const { input, setInput } = useContext(QueryContext);

    /**
     * Fecth to get all contacts from the database
     */

    const getAllContacts = async () => {
        const response = await fetch(`http://localhost:4000/v1/contact?q=${input}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Sort': 'ASC',
                'Column': 'id',
                'limit': limit,
                'offset': 0
            }
        });
        const contacts = await response.json();
        setAllData(contacts);
    }

    /**
     * 
     * @param {*} e - event used to get in real time the information from the input
     */

    const handleInput = (e) => {
        e.preventDefault();
        const text = e.target.value;
        setInput(text);
    }

    /**
     * This arrays contains the information for the search button
     */

    const searchBtn = [
        {
            class: 'search-btn',
            text: '<i class="fas fa-search"></i>',
            type: 'submit',
            func: function (e) {
                e.preventDefault();
                getAllContacts();
            }
        }
    ]

    /**
     * This useEffect allows to search from contacts every time when the input state changes
     */

    useEffect(() => {
        getAllContacts();
    }, [input])

    return (
        <>
            <form className='search-container'>
                <input className='input-search' type='text' maxLength='100' onChange={handleInput} />
                <Button dataBtn={searchBtn} />
            </form>
        </>
    )
}

export default SearchInputComponent;