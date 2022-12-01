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
import { ModalDataInputContext } from '../../context/ModalDataInputContext';
import { ChannelContext } from '../../context/ChannelContext';

// Styles

import './DataComponent.css';

// Functions

const DataComponent = ({ data, token, className, checkboxClass, page }) => {

    /**
     * States and Contexts to handle the data.
     */

    const { setCloseNode } = useContext(DataContext);

    const { setInfoComponent } = useContext(InfoComponentContext);

    const { current, setCurrent } = useContext(CurrentDataManagerContext);

    const { setAllData } = useContext(DataTableContext);

    const { limit } = useContext(LimitDataContext);

    const [info, setInfo] = useState([]);

    const { setUuid } = useContext(DataInputsContext);

    const profile = data.profile ? "Administrador" : "Básico";

    const [company, setCompany] = useState([]);

    const { channels, setChannels } = useContext(ChannelContext);

    const [handleButton, setHandleButton] = useState("");

    const [id, setId] = useState("");

    const [setOtherChannels] = useState([]);

    const [channelUuid, setChannelUuid] = useState("");

    const { inputData } = useContext(ModalDataInputContext);

    const [imageBase64, setImageBase64] = useState("");

    /**
     * Get all regions
     */

    const getAllRegions = async () => {
        const response = await fetch(`http://localhost:4000/v1/region/${data.region && data.region.uuid}`, {
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
        const response = await fetch(`http://localhost:4000/v1/country/${data.country && data.country.uuid}`, {
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
        const response = await fetch(`http://localhost:4000/v1/city/${data.city && data.country.uuid}`, {
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
        page !== "contactos" && page === "compañias" && setAllData(companies);
        if (page === "contactos") {
            setCompany(
                [
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
                ]
            )
        }
    }

    /**
     * Fetch to get all contacts from database
     */

    const getAllContacts = async () => {
        const response = await fetch('http://localhost:4000/v1/contact', {
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
     * Fetch to delete a contact by its uuid
     */

    const deleteContact = async () => {
        const { uuid } = data;
        const requestOpt = {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
        const response = await fetch(`http://localhost:4000/v1/contact/${uuid}`, requestOpt);
        const dataRes = await response.json();
        dataRes && getAllContacts();
    }

    /**
     * This function allows to convert buffer data from an image to a base64 string
     */

    const bufferToBase64 = () => {
        const buffer = data.image.data.data;
        const base64 = btoa(
            buffer.reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
        setImageBase64(base64);
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
     * Set every config to open correctly the edit contact modal
     */

    const editCurrentContact = () => {
        setCurrent("edit-contact");
        setInfoComponent(editContactObj);
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
     * Function to clear the company's input in the edit contact modal
     */

    const clearCompanyInput = () => {
        delete editContactObj.data_fields[4].option[0];
        delete editContactObj.data_fields[5];
        editContactObj.data_fields[4].option = company;
        setUuid({});
    }

    /**
     * Function to clear all the inputs in the more info section from the edit contact modal
     */

    const clearInputsContact = () => {
        delete editContactObj.moreInfoAddContact;
        setUuid({});
    }

    /**
     * Function to delete locally one channel before to send it to the server
     */

    const deleteChannelLocal = () => {
        const deleteChannel = channels.filter((data) => data[0].value !== id);
        setChannels(deleteChannel);
    }

    /**
     * Function to set the information at the channels and to allow to edit them
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
                disable: false,
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
     * Function to save locally a channel before to send it to the server
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
            data: data.country ? data.country.name : "N/A"
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
                value: data.name
            },
            {
                title: "Apellido",
                require: false,
                type: "text",
                name: "last_name",
                value: data.last_name || ""
            },
            {
                title: "Correo Electrónico",
                require: true,
                type: "email",
                name: "email",
                value: data.email
            },
            {
                title: "Perfil",
                require: true,
                type: "text",
                name: "profile",
                value: data.profile ? "Administrador" : "Básico",
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
                value: data.name
            },
            {
                title: "Correo Electrónico",
                require: true,
                type: "email",
                name: "email",
                value: data.email
            },
            {
                title: "Telefono",
                require: true,
                type: "text",
                name: "phone",
                value: data.phone
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

    const editContactObj = {
        title_component: "Editar contacto",
        data_fields: [
            {
                title: "Nombre",
                require: true,
                type: "text",
                name: "name",
                value: data.name
            },
            {
                title: "Apellido",
                require: true,
                type: "text",
                name: "last_name",
                value: data.last_name
            },
            {
                title: "Cargo",
                require: true,
                type: "text",
                name: "position",
                value: data.position
            },
            {
                title: "Correo Electrónico",
                require: true,
                type: "email",
                name: "email",
                value: data.email
            },
            {
                title: "Compañia",
                type: "select",
                name: "company",
                option: [],
                require: true
            },
            {
                btn: [
                    {
                        class: "edit-button-small",
                        text: '<i class="fas fa-pen more-info-btn"></i>',
                        type: "button",
                        func: () => {
                            clearCompanyInput();
                        }
                    }
                ]

            }
        ],
        owner: data,
        pic: true,
        image: `data:image/png;base64,${imageBase64}`,
        image_uuid: data.image ? data.image.uuid : "",
        moreInfoAddContact: [
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
                name: "address",
                disable: false,
                require: true,
                value: data.address
            },
            {
                title: "Interés",
                type: "select",
                name: "interest",
                option: [
                    {
                        name: `${data.interest}%`,
                        value: data.interest
                    }
                ],
                require: false
            },
            {
                btn: [
                    {
                        class: "edit-button-small",
                        text: '<i class="fas fa-pen more-info-btn"></i>',
                        type: "button",
                        func: () => {
                            clearInputsContact();
                        }
                    }
                ]

            }
        ],
        channels: channels
    }

    /**
     * This object contains every data to show in the channel input during the edit mode // if you wanted add more data, you could do it setting the new information here 
     */

    const optionInputObj = {
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
     * Function to handle the information to all the selects inputs at the edit contact mode
     */

    const setContactOptions = () => {
        let objCompany = {
            name: data.company ? data.company.name : "N/A",
            value: data.company ? data.company.uuid : ""
        }

        let objRegion = {
            name: data.region ? data.region.name : "N/A",
            value: data.region ? data.region.uuid : ""
        }

        let objCountry = {
            name: data.country ? data.country.name : "N/A",
            value: data.country ? data.country.uuid : ""
        }

        let objCity = {
            name: data.city ? data.city.name : "N/A",
            value: data.city ? data.city.uuid : ""
        }

        editContactObj.data_fields[4].option.push(objCompany);
        editContactObj.moreInfoAddContact[0].option.push(objRegion);
        editContactObj.moreInfoAddContact[1].option.push(objCountry);
        editContactObj.moreInfoAddContact[2].option.push(objCity);
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
     * Some useEffects to change the information in real time
     */

    useEffect(() => {
        getAllCompanies();
        page === "contactos" && bufferToBase64();
    }, [])

    useEffect(() => {

        // This iterator sets every button in the channels got from the database, this isn't working well.

        for (let index = 0; index < channels.length; index++) {
            channels[index][4].btn[0].func = function () {
                setHandleButton("edit-channel");
                setId(channels[index][0].value);
            }
            channels[index][4].btn[1].func = function () {
                setHandleButton("delete-channel");
                setId(channels[index][0].value);
            }
        }
    }, [current])

    useEffect(() => {
        editContactObj.channels = channels;
    }, [channels])

    useEffect(() => {
        handleButton === "edit-channel" && editChannelLocal();
        handleButton === "delete-channel" && deleteChannelLocal();
    }, [handleButton, id])

    useEffect(() => {
        handleButton === "save-changes" && saveChangeChannel();
    }, [handleButton])

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
        } else if (page === "contactos") {
            deleteContact();
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
        } else if (page === "contactos") {
            setChannels(JSON.parse(data.channel));
            setContactOptions();
            editCurrentContact();
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
        } else if (page === "contactos") {
            bufferToBase64();
            setInfo([
                {
                    image: true,
                    data: data.name,
                    secondary_data: data.last_name,
                    subtitle: data.email
                },
                {
                    data: data.country ? data.country.name : "N/A",
                    subtitle: data.region ? data.region.name : "N/A"
                },
                {
                    data: data.company ? data.company.name : "N/A"
                },
                {
                    data: data.position
                },
                {
                    graph: true,
                    data: data.interest
                }
            ]);
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
                            <div className={item.image ? "profile-photo" : "hide-photo"}>
                                <img src={data.image && `data:image/png;base64,${imageBase64}`} alt="profile photo" className="data-image" />
                            </div>
                            <div className="data-container">
                                <div className={item.graph && "hide-title"}>
                                    {item.data} {item.secondary_data ? item.secondary_data : ""}
                                </div>
                                <div className={item.subtitle ? "data-subtitle" : "hide-subtitle"}>
                                    {item.subtitle ? item.subtitle : ""}
                                </div>
                                <div className={item.graph ? "data-graph-container" : "hide-data-graph"}>
                                    <div className="value">
                                        {`${item.data}%`}
                                    </div>
                                    <div className="interest-bar-container">
                                        <div className={item.data == "0" ? "color-0" : item.data == "25" ? "color-25" : item.data == "50" ? "color-50" : item.data == "75" ? "color-75" : item.data == "100" && "color-100"}></div>
                                    </div>
                                </div>
                            </div>
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