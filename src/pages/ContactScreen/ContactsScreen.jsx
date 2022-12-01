// Dependencies

import React, { useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Components

import Button from '../../components/Button/Button';
import DataManager from '../../components/DataManager/DataManager';
import DataTable from '../../components/DataTable/DataTable';
import SearchInputComponent from '../../components/SearchInputComponent/SearchInputComponent';
import { ChannelContext } from '../../context/ChannelContext';
import { CurrentDataManagerContext } from '../../context/CurrentDataManagerContext';
import { DataContext } from '../../context/DataContext';
import { DataInputsContext } from '../../context/DataInputsContext';
import { DataTableContext } from '../../context/DataTableContext';
import { InfoComponentContext } from '../../context/InfoComponentContext';
import { LimitDataContext } from '../../context/LimitDataContext';
import { ModalDataInputContext } from '../../context/ModalDataInputContext';
import { OffsetContext } from '../../context/OffsetContext';
import { QueryContext } from '../../context/QueryContext';

// Styles

import './ContactScreen.css';

// Functions

const ContactsScreen = () => {

    /**
     * states and context to handle the data
     */

    const { current, setCurrent } = useContext(CurrentDataManagerContext);

    const { infoComponent, setInfoComponent } = useContext(InfoComponentContext);

    const token = JSON.parse(localStorage.getItem('token'));

    const { setCloseNode } = useContext(DataContext);

    const [companies, setCompanies] = useState([]);

    const [option, setOption] = useState({});

    const { uuid } = useContext(DataInputsContext);

    const [inputDisable, setInputDisable] = useState(true);

    const [channel, setChannel] = useState({});

    const [inputDisableChannel, setInputDisableChannel] = useState(true);

    const { inputData } = useContext(ModalDataInputContext);

    const { channels, setChannels } = useContext(ChannelContext);

    const [id, setId] = useState("");

    const [handleButton, setHandleButton] = useState("");

    const [setOtherChannels] = useState([]);

    const [channelUuid, setChannelUuid] = useState("");

    const { allData, setAllData } = useContext(DataTableContext);

    const [column, setColumn] = useState("id");

    const [totalResults, setTotalResults] = useState(0);

    const { limit } = useContext(LimitDataContext);

    const { offset } = useContext(OffsetContext);

    const [sort, setSort] = useState("ASC");

    const { input } = useContext(QueryContext);

    const [btnChannel, setBtnChannel] = useState(
        [
            {
                class: "no-active-add",
                text: '<i class="fas fa-pen more-info-btn"></i>Agregar Canal',
                type: "button"
            }
        ]
    );

    /**
     * Fecth to get all the contacts from the database with query included
     */

    const getAllContacts = async () => {
        const response = await fetch(`http://localhost:4000/v1/contact?q=${input}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Sort': sort,
                'Column': column,
                'limit': limit,
                'offset': offset
            }
        });
        const contacts = await response.json();
        setAllData(contacts);
    }

    /**
     * Fecth to get the total number of contact and set it at the datatable
     */

    const getTotalResults = async () => {
        const response = await fetch('http://localhost:4000/v1/contact', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Sort': sort,
                'Column': column,
                'limit': 1000,
                'offset': 0
            }
        });
        const contacts = await response.json();
        setTotalResults(contacts.length);
    }

    /**
    * This fetch is used to get all companies from database.
    */

    const getAllCompanies = async () => {
        const response = await fetch('http://localhost:4000/v1/company', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Sort': 'ASC',
                'Column': 'id',
                'limit': 1000,
                'offset': 0
            }
        });
        const companies = await response.json();
        setCompanies([
            {
                name: "Selecciona una opción",
                value: ""
            },
            ...companies.map((company) => {
                return {
                    value: company.uuid,
                    name: company.name,
                }
            })
        ])
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
     * Function to delete a channel locally before to send it to the server
     */

    const deleteChannelLocal = () => {
        const deleteChannel = channels.filter((data) => data[0].value !== id);
        setChannels(deleteChannel);
    }

    /**
     * Function to edit a channel locally before to send it to the server
     */

    const editChannelLocal = () => {
        const channelData = channels.filter((data) => data[0].value === id);
        setChannelUuid(channelData[0][0]);
        setChannels([
            [{
                title: "Canal de Contacto",
                type: "select",
                name: "channel",
                option: optionInputObj.channel,
                require: false
            },
            {
                title: "Cuenta de Usuario",
                type: "text",
                name: "account",
                value: channelData[0][2].value,
                disable: inputDisableChannel,
                require: false
            },
            {
                title: "Preferencias",
                type: "select",
                name: "preference",
                option: optionInputObj.preference,
                require: false
            },
            {
                btn:
                    [
                        {
                            class: "edit-more-info",
                            text: 'Guardar Cambios',
                            type: "button",
                            func: () => {
                                setOtherChannels(channels.filter((data) => data[0].value !== id));
                                setHandleButton("save-changes");
                            }
                        }
                    ]

            }],
            ...channels.filter((data) => data[0].value !== id)
        ])
    }

    /**
     *  Function to set all the input fields in the create channel section but when the channel is already created
     */

    const saveChangeChannel = () => {
        const channelData = optionInputObj.channel.filter((data) => data.value === inputData.channel);
        const preferenceData = optionInputObj.preference.filter((data) => data.value === inputData.preference);
        setChannels([
            [
                channelUuid,
                {
                    title: "Canal de Contacto",
                    type: "select",
                    name: "channel",
                    option: channelData,
                    require: false
                },
                {
                    title: "Cuenta de Usuario",
                    type: "text",
                    name: "account",
                    value: inputData.account,
                    disable: true,
                    require: false
                },
                {
                    title: "Preferencias",
                    type: "select",
                    name: "preference",
                    option: preferenceData,
                    require: false
                },
                {
                    btn:
                        [
                            {
                                class: "edit-more-info",
                                text: '<i class="fas fa-pen more-info-btn"></i>Editar Canal',
                                type: "button",
                                func: () => {
                                    setHandleButton("edit-channel");
                                    setId(channelUuid.value);
                                }
                            },
                            {
                                class: "edit-more-info",
                                text: '<i class="fas fa-pen more-info-btn"></i>Eliminar Canal',
                                type: "button",
                                name: channelUuid.value,
                                func: () => {
                                    setHandleButton("delete-channel");
                                    setId(channelUuid.value);
                                }
                            },
                        ],
                }
            ],
            ...channels.filter((data) => data[0].value !== id && data[0].value)
        ])
    }

    /**
     * Function to set the input fields to the create channel section
     */

    const newChannel = () => {
        const channelData = optionInputObj.channel.filter((data) => data.value === inputData.channel);
        const preferenceData = optionInputObj.preference.filter((data) => data.value === inputData.preference);
        const uuidData = uuidv4();
        setChannels([
            [
                {
                    value: uuidData,
                    type: "id"
                },
                {
                    title: "Canal de Contacto",
                    type: "select",
                    name: "channel",
                    option: channelData,
                    require: false
                },
                {
                    title: "Cuenta de Usuario",
                    type: "text",
                    name: "account",
                    value: inputData.account,
                    disable: true,
                    require: false
                },
                {
                    title: "Preferencias",
                    type: "select",
                    name: "preference",
                    option: preferenceData,
                    require: false
                },
                {
                    btn:
                        [
                            {
                                class: "edit-more-info",
                                text: '<i class="fas fa-pen more-info-btn"></i>Editar Canal',
                                type: "button",
                                func: () => {
                                    setHandleButton("edit-channel");
                                    setId(uuidData);
                                }
                            },
                            {
                                class: "edit-more-info",
                                text: '<i class="fas fa-pen more-info-btn"></i>Eliminar Canal',
                                type: "button",
                                name: uuidData,
                                func: () => {
                                    setHandleButton("delete-channel");
                                    setId(uuidData)
                                }
                            },
                        ],
                }
            ],
            ...channels
        ])
    }

    /**
     * Some useEffects to handle the information in real time
     */

    useEffect(() => {
        handleButton == "edit-channel" && editChannelLocal();
        handleButton == "delete-channel" && deleteChannelLocal();
    }, [handleButton, id])

    useEffect(() => {
        setInfoComponent(addContactObj);
        getAllContacts();
        getAllCompanies();
        getAllRegions();
    }, [])

    useEffect(() => {
        getTotalResults();
    }, [allData]);

    useEffect(() => {
        getAllContacts();
    }, [limit, offset, sort]);

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

    useEffect(() => {
        inputData.channel && inputData.channel !== "" ? setInputDisableChannel(false) : setInputDisableChannel(true);
        inputData.channel !== "" && inputData.channel && inputData.account !== "" && inputData.account ? setChannel({
            ...channel,
            preference: optionInputObj.preference
        }) : setChannel({
            ...channel,
            preference: []
        });
        inputData.channel !== "" && inputData.channel && inputData.account !== "" && inputData.account && inputData.preference !== "" && inputData.preference ? setBtnChannel(btnChannelObj.btn_active) : setBtnChannel(btnChannelObj.btn);
    }, [inputData])

    useEffect(() => {
        handleButton == "save-changes" && saveChangeChannel();
    }, [handleButton]);

    /**
    * An object with every data for the button component. (Includes the function for every button.)
    */

    const btnChannelObj = {
        btn_active:
            [
                {
                    class: "edit-more-info",
                    text: '<i class="fas fa-pen more-info-btn"></i>Agregar Canal',
                    type: "button",
                    func: newChannel
                }
            ],
        btn:
            [
                {
                    class: "no-active-add",
                    text: '<i class="fas fa-pen more-info-btn"></i>Agregar Canal',
                    type: "button"
                }
            ]
    }

    /**
     * An object with all data to be displayed on the select inputs at the create contact modal
     */

    const optionInputObj = {
        interest: [
            {
                name: "Seleccione una opción",
                value: ""
            },
            {
                name: "0%",
                value: 0
            },
            {
                name: "25%",
                value: 25
            },
            {
                name: "50%",
                value: 50
            },
            {
                name: "75%",
                value: 75
            },
            {
                name: "100%",
                value: 100
            },
        ],
        channel: [
            {
                name: "Seleccione una opción",
                value: ""
            },
            {
                name: "Llamada",
                value: "call"
            },
            {
                name: "Mensaje",
                value: "message"
            },
            {
                name: "Whatsapp",
                value: "wa"
            },
            {
                name: "Instagram",
                value: "insta"
            },
            {
                name: "Facebook",
                value: "fb"
            },
            {
                name: "Correo Electrónico",
                value: "email"
            },
            {
                name: "Twitter",
                value: "tw"
            },
            {
                name: "LinkedIn",
                value: "li"
            }
        ],
        preference: [
            {
                name: "Seleccione una opción",
                value: ""
            },
            {
                name: "Canal Favorito",
                value: "fav"
            },
            {
                name: "No Molestar",
                value: "dndisturb"
            }
        ]
    }

    /**
     * Some objects that help to show every input at the create contact modal
     */

    const addContactObj = {
        title_component: "Nuevo contacto",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                owner_data: ""
            },
            {
                title: "Apellido",
                require: true,
                type: "text",
                name: "last_name",
                owner_data: ""
            },
            {
                title: "Cargo",
                require: true,
                type: "text",
                name: "position",
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
                title: "Compañia",
                type: "select",
                name: "company",
                option: companies,
                require: true
            }
        ],
        pic: true
    }

    const moreInfoAddContact = [
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
        },
        {
            title: "Interés",
            type: "select",
            name: "interest",
            option: optionInputObj.interest,
            require: false
        }
    ]

    const channelContactObj = [
        {
            title: "Canal de Contacto",
            type: "select",
            name: "channel",
            option: optionInputObj.channel,
            require: false
        },
        {
            title: "Cuenta de Usuario",
            type: "text",
            name: "account",
            disable: inputDisableChannel,
            require: false
        },
        {
            title: "Preferencias",
            type: "select",
            name: "preference",
            option: channel.preference ?? [],
            require: false
        },
        {
            btn: btnChannel

        }
    ]

    /**
     * Function to set the information in the create contact modal
     */

    const createContact = () => {
        setInfoComponent(addContactObj);
        setCloseNode("data-manager-bg active-modal");
        setCurrent("new-contact");
        setChannels([]);
    }

    /**
     * An array that contains the data for the button displayed in the main screen -- Create contact button
     */

    const addContactBtn = [
        {
            class: "add-contact-btn",
            text: "Agregar contacto",
            func: createContact
        }
    ]

    /**
     * This array has all the data that it will create all the columns on the "data table".
     */

    const columns = [
        {
            title: "Contacto",
            sort: true,
            func: () => {
                setColumn("name");
                if (sort === "ASC") {
                    setSort("DESC");
                    getAllContacts();
                } else if (sort === "DESC") {
                    setSort("ASC");
                    getAllContacts();
                }
            }
        },
        {
            title: "País/Región",
            sort: true,
            func: () => {
                setColumn("country.name");
                if (sort === "ASC") {
                    setSort("DESC");
                    getAllContacts();
                } else if (sort === "DESC") {
                    setSort("ASC");
                    getAllContacts();
                }
            }
        },
        {
            title: "Compañía",
            sort: true,
            func: () => {
                setColumn("company.name");
                if (sort === "ASC") {
                    setSort("DESC");
                    getAllContacts();
                } else if (sort === "DESC") {
                    setSort("ASC");
                    getAllContacts();
                }
            }
        },
        {
            title: "Cargo",
            sort: true,
            func: () => {
                setColumn("position");
                if (sort === "ASC") {
                    setSort("DESC");
                    getAllContacts();
                } else if (sort === "DESC") {
                    setSort("ASC");
                    getAllContacts();
                }
            }
        },
        {
            title: "Interés",
            sort: true,
            func: () => {
                setColumn("interest");
                if (sort === "ASC") {
                    setSort("DESC");
                    getAllContacts();
                } else if (sort === "DESC") {
                    setSort("ASC");
                    getAllContacts();
                }
            }
        },
        {
            title: "Acciones",
            sort: false
        }
    ]

    return (
        <>
            <DataManager info={infoComponent} current={current} token={token} moreInfo={infoComponent.moreInfoAddContact ? infoComponent.moreInfoAddContact : moreInfoAddContact} scrollData={channelContactObj} channel={channels} />
            <div className='contact-section-container'>
                <div className='contact-title-container'>
                    <div className='search-title-container'>
                        <div className='contact-title'>
                            Contactos
                        </div>
                        <div className='input-container'>
                            <SearchInputComponent />
                        </div>
                    </div>
                    <div className='contact-btn-container'>
                        <Button dataBtn={addContactBtn} />
                    </div>
                </div>
                <>
                    <DataTable user={allData} tableClass={"contact-table-container"} token={token} title_delete={"contactos"} columns={columns} totalResults={totalResults} />
                </>
            </div>
        </>
    )
}

export default ContactsScreen;