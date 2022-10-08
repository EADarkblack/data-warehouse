// Libraries

import React, { useContext, useState, useEffect } from 'react';

// Components

import Button from '../../components/Button/Button';
import DataManager from '../../components/DataManager/DataManager';
import DataTable from '../../components/DataTable/DataTable';
import { CurrentDataManagerContext } from '../../context/CurrentDataManagerContext';
import { InfoComponentContext } from '../../context/InfoComponentContext';
import { DataContext } from '../../context/DataContext';
import { DataInputsContext } from '../../context/DataInputsContext';
import { DataTableContext } from '../../context/DataTableContext';
import { LimitDataContext } from '../../context/LimitDataContext';
import { OffsetContext } from '../../context/OffsetContext';

// Styles

import './CompanyScreen.css';

// Functions

const CompanyScreen = () => {

    /**
     * States and Contexts to handle the data.
     */

    const { current, setCurrent } = useContext(CurrentDataManagerContext);

    const { infoComponent, setInfoComponent } = useContext(InfoComponentContext);

    const { setCloseNode } = useContext(DataContext);

    const [option, setOption] = useState({});

    const [inputDisable, setInputDisable] = useState(true);

    const token = JSON.parse(localStorage.getItem('token'));

    const { uuid } = useContext(DataInputsContext);

    const { allData, setAllData } = useContext(DataTableContext);

    const { limit } = useContext(LimitDataContext);

    const { offset } = useContext(OffsetContext);

    const [sort, setSort] = useState("ASC");

    const [column, setColumn] = useState("id");

    const [totalResults, setTotalResults] = useState(0);

    /**
     * This fetch is used to get all companies from database.
     */

    const getAllCompanies = async () => {
        const response = await fetch('http://localhost:4000/v1/company', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Sort': sort,
                'Column': column,
                'limit': limit,
                'offset': offset
            }
        });
        const companies = await response.json();
        setAllData(companies);
    }

    /**
     * This fetch is used to get the total number of data saved in the company's table
     */

    const getTotalResults = async () => {
        const response = await fetch('http://localhost:4000/v1/company', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Sort': sort,
                'Column': column,
                'limit': 1000,
                'offset': 0
            }
        });
        const companies = await response.json();
        setTotalResults(companies.length);
    }

    /**
     * This fetch is used to get all the regions to show them on the modal.
     */

    const getAllRegions = async () => {
        const response = await fetch('http://localhost:4000/v1/region', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const regions = await response.json();
        await setOption({
            region: [
                {
                    name: 'Seleccione una región',
                    value: ''
                },
                ...regions.map((region) => {
                    return {
                        name: region.name,
                        value: region.uuid
                    }
                })
            ]
        });
    }

    /**
     * This fetch is used to get all countries from a region by its uuid
     */

    const getCountryFromRegion = async (id) => {
        const response = await fetch(`http://localhost:4000/v1/region/${id}/country`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const countries = await response.json();
        setOption({
            ...option,
            country: [
                {
                    name: 'Seleccione un país',
                    value: ''
                },
                ...countries.map((country) => {
                    return {
                        name: country.name,
                        value: country.uuid
                    }
                })
            ]
        });
    }

    /**
     * This Fetch is used to get all cities from a country by its uuid
     */

    const getCityFromCountry = async (id) => {
        const response = await fetch(`http://localhost:4000/v1/country/${id}/city`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const cities = await response.json();
        setOption({
            ...option,
            city: [
                {
                    name: 'Seleccione una ciudad',
                    value: ''
                },
                ...cities.map((city) => {
                    return {
                        name: city.name,
                        value: city.uuid
                    }
                })
            ]
        });
    }

    /**
     * This useEffect executes these functions when the screen loads by first time.
     */

    useEffect(() => {
        getAllCompanies();
        getAllRegions();
    }, [])

    /**
     * An useEffect hook that allows to execute the getTotalResults function when allData change.
     */

    useEffect(() => {
        getTotalResults();
    }, [allData]);

    /**
     * An useEffect hook that allows to execute the getAllCompanies function when the limit and offset change.
     */

    useEffect(() => {
        getAllCompanies();
    }, [limit, offset]);

    /**
     * This useEffect is used to save all the location's uuid in a context.
     */

    useEffect(() => {
        uuid.region !== "" && uuid.region ? getCountryFromRegion(uuid.region) : setOption({
            ...option,
            country: [],
            city: []
        });
        uuid.region !== "" && uuid.country !== "" && uuid.country ? getCityFromCountry(uuid.country) : setOption({
            ...option,
            country: [],
            city: []
        });
        uuid.country && uuid.country !== "" && uuid.city && uuid.city !== "" ? setInputDisable(false) : setInputDisable(true);
    }, [uuid])

    /**
     * Objects used to show all the inputs on the modal.
     */

    const addCompanyObj = {
        title_component: "Nueva compañia",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                owner_data: ""
            },
            {
                title: "Correo Electrónico",
                require: true,
                type: "email",
                name: "email",
                owner_data: ""
            },
            {
                title: "Telefono",
                require: true,
                type: "text",
                name: "phone",
                owner_data: ""
            }
        ],
        pic: false
    }

    const moreInfoAddCompany = [
        {
            title: "Región",
            type: "select",
            name: "region",
            option: option.region ? option.region : [],
            require: true
        },
        {
            title: "País",
            type: "select",
            name: "country",
            option: option.country ? option.country : [],
            require: true
        },
        {
            title: "Ciudad",
            type: "select",
            name: "city",
            option: option.city ? option.city : [],
            require: true
        },
        {
            title: "Dirección",
            type: "text",
            name: "address",
            disable: inputDisable,
            require: true
        }
    ]

    /**
     * This functions is used to set new states for the "New company" modal.
     */

    const createCompany = () => {
        setInfoComponent(addCompanyObj);
        setCloseNode("data-manager-bg active-modal");
        setCurrent("new-company")
    }

    /**
     * This array has all the data that it will use to show the "create company" button on the "company's screen".
     */

    const addCompanyBtn = [
        {
            class: "add-company-btn",
            text: "Agregar compañía",
            func: createCompany
        }
    ]

    /**
     * This array has all the data that it will create all the columns on the "data table".
     */

    const columns = [
        {
            title: "Nombre",
            sort: true,
            func: () => {
                if (column === "id") {
                    setSort("ASC");
                    setColumn("name");
                    getAllCompanies();
                } else if (sort === "ASC") {
                    setSort("DESC");
                    setColumn("name");
                    getAllCompanies();
                } else if (sort === "DESC") {
                    setSort("ASC");
                    setColumn("id");
                    getAllCompanies();
                }
            }
        },
        {
            title: "País",
            sort: false
        },
        {
            title: "Dirección",
            sort: false
        },
        {
            title: "Acciones",
            sort: false
        }
    ]

    return (
        <>
            <DataManager info={infoComponent} current={current} token={token} moreInfo={infoComponent.moreInfoAddCompany ? infoComponent.moreInfoAddCompany : moreInfoAddCompany} />
            <div className="company-section-container">
                <div className="company-title-container">
                    <div className="company-title">
                        Compañias
                    </div>
                    <div className="company-btn-container">
                        <Button dataBtn={addCompanyBtn} />
                    </div>
                </div>
                <hr />
                <>
                    <DataTable user={allData} tableClass={"company-table-container"} token={token} title_delete={"compañias"} columns={columns} totalResults={totalResults} />
                </>
            </div>
        </>
    )
}

export default CompanyScreen;