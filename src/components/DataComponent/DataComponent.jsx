// Libraries

import React, { useContext, useState, useEffect } from 'react';

// Components

import Checkbox from '../Checkbox/Checkbox';
import { DataContext } from '../../context/DataContext';
import { InfoComponentContext } from '../../context/InfoComponentContext';
import { CurrentDataManagerContext } from '../../context/CurrentDataManagerContext';
import { DataTableContext } from '../../context/DataTableContext';
import { LimitDataContext } from '../../context/LimitDataContext';
import { DataInputsContext } from '../../context/DataInputsContext';

// Styles

import './DataComponent.css';

// Functions

const DataComponent = ({ data, token, className, checkboxClass, page }) => {

    /**
     * States and Contexts to handle the data.
     */

    const { setCloseNode } = useContext(DataContext);

    const { setInfoComponent } = useContext(InfoComponentContext);

    const { setCurrent } = useContext(CurrentDataManagerContext);

    const { setAllData } = useContext(DataTableContext);

    const { limit } = useContext(LimitDataContext);

    const [info, setInfo] = useState([]);

    const { setUuid } = useContext(DataInputsContext);

    const profile = data.profile ? "Administrador" : "Básico";

    /**
     * Get all regions
     */

    const getAllRegions = async () => {
        const response = await fetch(`http://localhost:4000/v1/region/${data.region.uuid}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const region = await response.json();
        let obj = {
            name: region.name,
            value: region.uuid
        }
        editCompanyObj.moreInfoAddCompany[0].option.push(obj);
    }

    /**
     * Get a specific country from a region by its uuid
     */

    const getCountryFromRegion = async () => {
        const response = await fetch(`http://localhost:4000/v1/country/${data.country.uuid}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const country = await response.json();
        let obj = {
            name: country.name,
            value: country.uuid
        }
        editCompanyObj.moreInfoAddCompany[1].option.push(obj);
    }

    /**
     * Get a specific city from a country by its uuid
     */

    const getCityFromCountry = async () => {
        const response = await fetch(`http://localhost:4000/v1/city/${data.city.uuid}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const city = await response.json();
        let obj = {
            name: city.name,
            value: city.uuid
        }
        editCompanyObj.moreInfoAddCompany[2].option.push(obj);
    }

    /**
     * Gets from the database the current version of all data.
     */

    const getRequestUser = async () => {
        const response = await fetch('http://localhost:4000/v1/user', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Sort': 'ASC',
                'Column': 'id',
                'limit': limit,
                'offset': 0
            }
        });
        const users = await response.json();
        setAllData(users);
    }

    /**
     * Get all companies from database
     */

    const getAllCompanies = async () => {
        const response = await fetch('http://localhost:4000/v1/company', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Sort': 'ASC',
                'Column': 'id',
                'limit': limit,
                'offset': 0
            }
        });
        const companies = await response.json();
        setAllData(companies);
    }

    /**
     * The delete request for the data from the data table.
     */

    const deleteData = async () => {
        const { uuid } = data;
        const requestOpt = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
        const response = await fetch(`http://localhost:4000/v1/user/${uuid}`, requestOpt);
        const dataRes = await response.json();
        dataRes && getRequestUser();
    }

    /**
     * Delete company from the database
     */

    const deleteCompany = async () => {
        const { uuid } = data;
        const requestOpt = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
        const response = await fetch(`http://localhost:4000/v1/company/${uuid}`, requestOpt);
        const dataRes = await response.json();
        dataRes && getAllCompanies();
    }

    /**
     * Allows modify the user selected by the admin user. this func set all data to their respective context.
     */

    const editCurrentUser = () => {
        setCurrent("edit-user");
        setInfoComponent(editUserObj);
        setCloseNode("data-manager-bg active-modal");
    }

    /**
     * Set the data used by the "edit mode" - change some states on the global states.
     */

    const editCurrentCompany = () => {
        setCurrent("edit-company");
        setInfoComponent(editCompanyObj);
        setUuid(locationDataObj);
        setCloseNode("data-manager-bg active-modal");
    }

    /**
     * Clear all location's inputs to edit them.
     */

    const clearMoreInfoInput = () => {
        setUuid({});
        delete editCompanyObj.moreInfoAddCompany;
    }

    /**
     * Object used to show the data in the "datatable component"
     */

    const userDataObj = [
        {
            data: data.name,
            secondary_data: data.last_name
        },
        {
            data: data.email
        },
        {
            data: profile
        }
    ]

    const companyDataObj = [
        {
            data: data.name
        },
        {
            data: data.country && data.country.name
        },
        {
            data: data.address
        }
    ]

    /**
     * Object used to show the information in the modal component.
     */

    const editUserObj = {
        title_component: "Editar usuario",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                owner_data: data.name
            },
            {
                title: "Apellido",
                require: false,
                type: "text",
                name: "last_name",
                owner_data: data.last_name || ""
            },
            {
                title: "Correo Electrónico",
                require: true,
                type: "email",
                name: "email",
                owner_data: data.email
            },
            {
                title: "Perfil",
                require: true,
                type: "text",
                name: "profile",
                owner_data: data.profile ? "Administrador" : "Básico",
                disable: false
            },
            {
                title: "Contraseña",
                require: true,
                type: "password",
                name: "password"
            },
            {
                title: "Repetir Contraseña",
                require: true,
                type: "password",
                name: "confirm_password"
            }
        ],
        owner: data,
        pic: false
    }

    const editCompanyObj = {
        title_component: "Editar compañia",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                owner_data: data.name
            },
            {
                title: "Correo Electrónico",
                require: true,
                type: "email",
                name: "email",
                owner_data: data.email
            },
            {
                title: "Telefono",
                require: true,
                type: "text",
                name: "phone",
                owner_data: data.phone
            }
        ],
        owner: data,
        pic: false,
        moreInfoAddCompany: [
            {
                title: "Región",
                type: "select",
                name: "region",
                option: [],
                require: true
            },
            {
                title: "País",
                type: "select",
                name: "country",
                option: [],
                require: true
            },
            {
                title: "Ciudad",
                type: "select",
                name: "city",
                option: [],
                require: true
            },
            {
                title: "Dirección",
                type: "text",
                value: data.address,
                disable: true,
                require: true
            },
            {
                btn: [
                    {
                        class: "edit-more-info",
                        text: '<i class="fas fa-pen more-info-btn"></i>Editar',
                        type: "button",
                        func: () => {
                            clearMoreInfoInput();
                        }
                    }
                ]

            }
        ]
    }

    /**
     * Function to get the company's location in the "edit mode".
     */

    const getRequests = () => {
        getAllRegions();
        getCountryFromRegion();
        getCityFromCountry();
    }

    /**
     * Object used to save every uuid and the address of the company
     */

    const locationDataObj = {
        region: data.region && data.region.uuid,
        country: data.country && data.country.uuid,
        city: data.city && data.city.uuid,
        address: data.address
    }

    /**
     * Function to handle all the delete's functions
     */

    const handleDeleteBtn = () => {
        if (page === "usuarios") {
            deleteData();
        } else if (page === "compañias") {
            deleteCompany();
        }
    }

    /**
     * Function to handle all the edit's functions
     */

    const handleEditBtn = () => {
        if (page === "usuarios") {
            editCurrentUser();
        } else if (page === "compañias") {
            editCurrentCompany();
            getRequests();
        }
    }

    /**
     * UseEffect used to get the new information from the database every time that "data" changes.
     */

    useEffect(() => {
        if (page === "usuarios") {
            setInfo(userDataObj);
        } else if (page === "compañias") {
            setInfo(companyDataObj);
            getCountryFromRegion();
        }
    }, [data])

    return (
        <div className={className}>
            <div className="checkbox-container">
                <Checkbox uuid={data.uuid} checkboxClass={checkboxClass} />
            </div>
            {
                info.map((item, i) => {
                    return (
                        <div className="data-box" key={i}>
                            {item.data} {item.secondary_data ? item.secondary_data : ""}
                        </div>
                    )
                })
            }
            <div className="data-box">
                <i className="fas fa-ellipsis-h"></i>
                <i onClick={handleDeleteBtn} className="fas fa-trash"></i>
                <i onClick={handleEditBtn} className="fas fa-pen"></i>
            </div>
        </div>
    )
}

export default DataComponent;