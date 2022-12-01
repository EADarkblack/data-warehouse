// Libraries

import React, { useContext, useState } from 'react';
import ImageUploading from 'react-images-uploading';

// Components

import { AuthContext } from '../../context/AuthContext';
import { ButtonContext } from '../../context/ButtonContext';
import { DataContext } from '../../context/DataContext';
import { DataTableContext } from '../../context/DataTableContext';
import { LimitDataContext } from '../../context/LimitDataContext';
import { ModalDataInputContext } from '../../context/ModalDataInputContext';
import { authTypes } from '../../types/authTypes';
import Button from '../Button/Button';
import ModalInputComponent from '../ModalInputComponent/ModalInputComponent';

// Styles

import './DataManager.css';

// Functions

const DataManager = ({ info, current, token, moreInfo, scrollData, channel }) => {

    /**
     * states and Contexts to handle the data.
     */

    const { dispatch } = useContext(AuthContext);

    const { closeNode, setCloseNode } = useContext(DataContext);

    const { inputData, setInputData } = useContext(ModalDataInputContext);

    const { setAllData } = useContext(DataTableContext);

    const { limit } = useContext(LimitDataContext);

    const [error, setError] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    const { activeBtn, setActiveBtn } = useContext(ButtonContext);

    const [image, setImage] = useState([]);

    /**
     * Allows close the "Data Manager" window on the app.
     */

    const closeNodeFunc = () => {
        setError(false);
        setErrorMsg("");
        setCloseNode("data-manager-bg");
        setInputData({});
        setImage([]);
    }

    /**
     * This function allows to handle all function on the app depending of the data type handler.
     * @param {obj} e - The event that allows to apply the preventDefault function to this function.
     */

    const handleRegister = (e) => {
        e.preventDefault();
        if (current === "new") {
            createNewUserFunc(inputData);
        } else if (current === "edit") {
            editOwner(inputData);
        } else if (current === "edit-user") {
            editUser(inputData);
        } else if (current === "new-region") {
            addRegion(inputData);
        } else if (current === "edit-region") {
            editRegion(inputData);
        } else if (current === "new-country") {
            addCountry(inputData);
        } else if (current === "edit-country") {
            editCountry(inputData);
        } else if (current === "new-city") {
            addCity(inputData);
        } else if (current === "edit-city") {
            editCity(inputData);
        } else if (current === "new-company") {
            addCompany(inputData);
        } else if (current === "edit-company") {
            editCompany(inputData);
        } else if (current === "new-contact") {
            addContact(inputData, channel, image);
        } else if (current === "edit-contact") {
            editContact(inputData, channel, image);
        }
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
     * Gets from the database the current version of all regions.
     */

    const getAllRegions = async () => {
        const response = await fetch('http://localhost:4000/v1/region', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const regions = await response.json();
        setAllData(regions);
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
     * Fetch to get all contacts from the database
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
     * Creates a new user when the admin user execute the create user button, this function gets all data from the inputs and later send all that data to the server. when the user is created successfully the "Data Manager" automatically close.
     */

    const createNewUserFunc = async (inputData) => {
        const { name, last_name, email, profile, password, confirm_password } = inputData;
        let profileBool = null;
        const profileClean = profile ? profile.trim() : null;
        if (profileClean === 'Administrador' || profileClean === 'Básico') {
            profileBool = profileClean === 'Administrador' ? true : false;
            setError(false);
            if (password === confirm_password) {
                if (name && email) {
                    const optionRequest = {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: name.trim(),
                            last_name: last_name ? last_name.trim() : null,
                            email: email.trim(),
                            profile: profileBool,
                            password: password
                        })
                    }
                    const response = await fetch('http://localhost:4000/v1/user/register', optionRequest);
                    const newUser = await response.json();
                    if (newUser.error) {
                        setErrorMsg("El correo electrónico ya está registrado.");
                        setError(true);
                    } else {
                        setInputData({});
                        setCloseNode("data-manager-bg");
                        getRequestUser();
                    }
                } else {
                    setErrorMsg("Los campos con * no pueden estar vacíos.");
                    setError(true);
                }
            } else {
                setErrorMsg("Las contraseñas no son iguales.");
                setError(true);
            }
        } else {
            setErrorMsg("Dato inválido: el perfil solo puede ser Administrador o Básico.");
            setError(true);
        }
    }

    /**
     * Allows edit an existing user on the database by his/her uuid, when the user is edited succesffully the same action from the create user function is execute with the only difference in this function the user is automatically logout from the app.
     */

    const editOwner = async (inputData) => {
        const { uuid } = info.owner;
        const { name, last_name, email, profile, password, confirm_password } = inputData;
        const profileClean = profile ? profile.trim() : null;
        let profileBool = null;
        if (profileClean === 'Administrador' || profileClean === 'Básico' || profileClean === null) {
            profileBool = profileClean === null && info.owner.profile;
            profileBool = profileClean === 'Administrador' ? true : false;
            setError(false);
            if (password === confirm_password) {
                const optionRequest = {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name ? name.trim() : info.owner.name,
                        last_name: last_name ? last_name.trim() : info.owner.last_name,
                        email: email ? email.trim() : info.owner.email,
                        profile: profileBool,
                        password: password
                    })
                }
                const response = await fetch(`http://localhost:4000/v1/user/${uuid}`, optionRequest);
                const data = await response.json();
                if (data.error) {
                    setErrorMsg("Dato inválido.");
                    setError(true);
                } else {
                    setInputData({});
                    dispatch({ type: authTypes.logout });
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } else {
                setErrorMsg("Las contraseñas no son iguales.");
                setError(true);
            }
        } else {
            setErrorMsg("Dato inválido: el perfil solo puede ser Administrador o Básico.");
            setError(true);
        }
    }

    /**
     * This function allows modify the data from an user selected by the admin on the table.
     */

    const editUser = async (inputData) => {
        const { uuid } = info.owner;
        const { name, last_name, email, profile, password, confirm_password } = inputData;
        const profileClean = profile ? profile.trim() : null;
        let profileBool = null;
        if (profileClean === 'Administrador' || profileClean === 'Básico' || profileClean === null) {
            if (profileClean === 'Administrador') {
                profileBool = true;
            } else if (profileClean === 'Básico') {
                profileBool = false;
            } else {
                profileBool = info.owner.profile;
            }
            setError(false);
            if (password === confirm_password) {
                const optionRequest = {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name ? name.trim() : info.owner.name,
                        last_name: last_name ? last_name.trim() : info.owner.last_name,
                        email: email ? email.trim() : info.owner.email,
                        profile: profileBool,
                        password: password
                    })
                }
                const response = await fetch(`http://localhost:4000/v1/user/${uuid}`, optionRequest);
                const data = await response.json();
                if (data.error) {
                    setErrorMsg("Dato inválido.");
                    setError(true);
                } else {
                    setInputData({});
                    setCloseNode("data-manager-bg");
                    getRequestUser();
                }
            } else {
                setErrorMsg("Las contraseñas no son iguales.");
                setError(true);
            }
        } else {
            setErrorMsg("Dato inválido: el perfil solo puede ser Administrador o Básico.");
            setError(true);
        }
    }

    /**
     * This function allows to create a new region on the database.
     */

    const addRegion = async (inputData) => {
        const { name } = inputData;
        if (name) {
            const optionRequest = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.trim()
                })
            }
            const response = await fetch('http://localhost:4000/v1/region/new', optionRequest);
            const newRegion = await response.json();

            if (newRegion.error) {
                setErrorMsg("La región ya existe.");
                setError(true);
            } else {
                setInputData({});
                setCloseNode("data-manager-bg");
                getAllRegions();
            }
        } else {
            setErrorMsg("Nombre de región inválido.");
            setError(true);
        }
    }

    /**
     * This function allows to edit a region on the database.
     */

    const editRegion = async (inputData) => {
        const { uuid } = info.owner;
        const { name } = inputData;
        const optionRequest = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name ? name.trim() : info.owner.name
            })
        }
        const response = await fetch(`http://localhost:4000/v1/region/${uuid}`, optionRequest);
        const data = await response.json();
        if (data.error) {
            setErrorMsg("Dato inválido.");
            setError(true);
        } else {
            setInputData({});
            setCloseNode("data-manager-bg");
            getAllRegions();
        }
    }

    /**
     * This function allows to create a new country on the database.
     */

    const addCountry = async (inputData) => {
        const { name } = inputData;
        if (name) {
            const optionRequest = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    region_uuid: info.region
                })
            }
            const response = await fetch('http://localhost:4000/v1/country/new', optionRequest);
            const newCountry = await response.json();
            if (newCountry.error) {
                setErrorMsg("El país ya existe.");
                setError(true);
            } else {
                setInputData({});
                setCloseNode("data-manager-bg");
                getAllRegions();
            }
        } else {
            setErrorMsg("Nombre de país inválido.");
            setError(true);
        }
    }

    /**
     * This function allows to edit a country on the database.
     */

    const editCountry = async (inputData) => {
        const { uuid } = info.owner;
        const { name } = inputData;
        const optionRequest = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name ? name.trim() : info.owner.name
            })
        }
        const response = await fetch(`http://localhost:4000/v1/country/${uuid}`, optionRequest);
        const data = await response.json();
        if (data.error) {
            setErrorMsg("Dato inválido.");
            setError(true);
        } else {
            setInputData({});
            setCloseNode("data-manager-bg");
            getAllRegions();
        }
    }

    /**
     * This function allows to create a new city on the database.
     */

    const addCity = async (inputData) => {
        const { name } = inputData;
        if (name) {
            const optionRequest = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    country_uuid: info.country
                })
            }
            const response = await fetch('http://localhost:4000/v1/city/new', optionRequest);
            const newCity = await response.json();
            if (newCity.error) {
                setErrorMsg("La ciudad ya existe.");
                setError(true);
            } else {
                setInputData({});
                setCloseNode("data-manager-bg");
                getAllRegions();
            }
        } else {
            setErrorMsg("Nombre de ciudad inválido.");
            setError(true);
        }
    }

    /**
     * This function allows to edit a city on the database.
     */

    const editCity = async (inputData) => {
        const { uuid } = info.owner;
        const { name } = inputData;
        const optionRequest = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name ? name.trim() : info.owner.name
            })
        }
        const response = await fetch(`http://localhost:4000/v1/city/${uuid}`, optionRequest);
        const data = await response.json();
        if (data.error) {
            setErrorMsg("Dato inválido.");
            setError(true);
        } else {
            setInputData({});
            setCloseNode("data-manager-bg");
            getAllRegions();
        }
    }

    /**
     * Function to create a new company.
     */

    const addCompany = async (inputData) => {
        const { name, email, phone, region, country, city, address } = inputData;
        if (name && email && phone && region && country && city && address) {
            const optionRequest = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    uuid_region: region,
                    uuid_country: country,
                    uuid_city: city,
                    address: address.trim()
                })
            }
            const response = await fetch('http://localhost:4000/v1/company/new', optionRequest);
            const newCompany = await response.json();
            if (newCompany.error) {
                setErrorMsg("El correo electrónico ya se encuentra registrado.");
                setError(true);
            } else {
                setError(false);
                setErrorMsg("");
                setInputData({});
                setCloseNode("data-manager-bg");
                getAllCompanies();
            }
        } else {
            setErrorMsg("Los campos con * no pueden estar vacíos.");
            setError(true);
        }
    }

    /**
     * Function to edit a company
     */

    const editCompany = async (inputData) => {
        const { uuid } = info.owner;
        const { name, email, phone, address, region, country, city } = inputData;
        const optionRequest = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name ? name.trim() : info.owner.name,
                email: email ? email.trim() : info.owner.email,
                phone: phone ? phone.trim() : info.owner.phone,
                address: address ? address.trim() : info.owner.address,
                uuid_region: region ? region : info.owner.uuid_region,
                uuid_country: country ? country : info.owner.uuid_country,
                uuid_city: city ? city : info.owner.uuid_city
            })
        }
        const response = await fetch(`http://localhost:4000/v1/company/${uuid}`, optionRequest);
        const data = await response.json();
        if (data.error) {
            setErrorMsg("Dato inválido.");
            setError(true);
        } else {
            setInputData({});
            setCloseNode("data-manager-bg");
            getAllCompanies();
        }
    }

    /**
     * Function to create a new contact, in case where the contact doesn't have a profile photo this function sets the deafult image's id // don't change the default image_id
     */

    const addContact = async (inputData, channel, image) => {
        const { name, last_name, position, email, company, region, country, city, address, interest } = inputData;
        if (name && last_name && position && email && company !== '' && region !== '' && country !== '' && city !== '' && address) {
            if (image.length !== 0) {
                const fd = new FormData();
                const blobData = image[0].file;
                fd.append('image', blobData);
                const optionRequest = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: fd
                }
                const response = await fetch('http://localhost:4000/v1/contact/image/new', optionRequest);
                const newImage = await response.json();
                if (newImage.id !== "") {
                    const optionContactRequest = {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: name.trim(),
                            last_name: last_name.trim(),
                            position: position.trim(),
                            email: email.trim(),
                            company_uuid: company,
                            region_uuid: region,
                            country_uuid: country,
                            city_uuid: city,
                            address: address.trim(),
                            channel: JSON.stringify(channel),
                            interest: interest,
                            image_id: newImage.id
                        })
                    }
                    const response = await fetch('http://localhost:4000/v1/contact/new', optionContactRequest);
                    const newContact = await response.json();
                    if (newContact.error) {
                        setErrorMsg("El correo electrónico ya se encuentra registrado.");
                        setError(true);
                    } else {
                        setError(false);
                        setErrorMsg("");
                        setInputData({});
                        setCloseNode("data-manager-bg");
                        setImage([]);
                        getAllContacts();
                    }
                } else {
                    setErrorMsg("Hubo un error al intentar subir la imagen");
                    setError(true);
                }
            } else {
                const optionContactRequest = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        last_name: last_name.trim(),
                        position: position.trim(),
                        email: email.trim(),
                        company_uuid: company,
                        region_uuid: region,
                        country_uuid: country,
                        city_uuid: city,
                        address: address.trim(),
                        channel: JSON.stringify(channel),
                        interest: interest,
                        image_id: 28
                    })
                }
                const response = await fetch('http://localhost:4000/v1/contact/new', optionContactRequest);
                const newContact = await response.json();
                if (newContact.error) {
                    setErrorMsg("El correo electrónico ya se encuentra registrado.");
                    setError(true);
                } else {
                    setError(false);
                    setErrorMsg("");
                    setInputData({});
                    setCloseNode("data-manager-bg");
                    setImage([]);
                    getAllContacts();
                }
            }
        }
        else {
            setErrorMsg("Los campos con * no pueden estar vacíos.");
            setError(true);
        }
    }

    /**
     * Function to edit any contact by its uuid, image_uuid is used to avoid to change the default image for anyelse image
     */

    const editContact = async (inputData, channel, image) => {
        const image_uuid = info.image_uuid;
        const fd = new FormData();
        const blobData = image.length > 0 && image[0].file;
        fd.append('image', blobData);
        const { name, last_name, position, email, company, region, country, city, address, interest } = inputData;
        if (image.length > 0) {
            if (image_uuid === "a56e815b-1bca-44ec-9b8e-ba77a42f0c49") {
                const optionRequest = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: fd
                }
                const response = await fetch('http://localhost:4000/v1/contact/image/new', optionRequest);
                const newImage = await response.json();
                const optionContactRequest = {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name ? name.trim() : info.owner.name,
                        last_name: last_name ? last_name.trim() : info.owner.last_name,
                        position: position ? position.trim() : info.owner.position,
                        email: email ? email.trim() : info.owner.email,
                        company_uuid: company ? company : info.owner.company.uuid,
                        region_uuid: region ? region : info.owner.region.uuid,
                        country_uuid: country ? country : info.owner.country.uuid,
                        city_uuid: city ? city : info.owner.city.uuid,
                        address: address ? address.trim() : info.owner.address,
                        channel: JSON.stringify(channel),
                        interest: interest ? interest : info.owner.interest,
                        image_id: newImage && newImage.id
                    })
                }
                const responseEditContact = await fetch(`http://localhost:4000/v1/contact/${info.owner.uuid}`, optionContactRequest);
                const updatedContact = await responseEditContact.json();
                if (updatedContact.error) {
                    setErrorMsg("Dato inválido.");
                    setError(true);
                } else {
                    setInputData({});
                    setCloseNode("data-manager-bg");
                    setImage([]);
                    getAllContacts();
                }
            } else {
                const optionRequest = {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: fd
                }
                const response = await fetch(`http://localhost:4000/v1/contact/image/${image_uuid}`, optionRequest);
                const updatedImage = await response.json();
                if (updatedImage.error) {
                    setErrorMsg("Error al actualizar la imagén.");
                    setError(true);
                }
            }
        }
        const optionContactRequest = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                name: name ? name.trim() : info.owner.name,
                last_name: last_name ? last_name.trim() : info.owner.last_name,
                position: position ? position.trim() : info.owner.position,
                email: email ? email.trim() : info.owner.email,
                company_uuid: company ? company : info.owner.company.uuid,
                region_uuid: region ? region : info.owner.region.uuid,
                country_uuid: country ? country : info.owner.country.uuid,
                city_uuid: city ? city : info.owner.city.uuid,
                address: address ? address.trim() : info.owner.address,
                channel: JSON.stringify(channel),
                interest: interest ? interest : info.owner.interest
            })
        }
        const response = await fetch(`http://localhost:4000/v1/contact/${info.owner.uuid}`, optionContactRequest);
        const updatedContact = await response.json();
        if (updatedContact.error) {
            setErrorMsg("Dato inválido.");
            setError(true);
        } else {
            setInputData({});
            setCloseNode("data-manager-bg");
            getAllContacts();
        }
    }

    /**
     * Function to get the information from a contact's image
     */

    const handleImageInput = async (imageList) => {
        setImage(imageList);
    }

    return (
        <div className={closeNode}>
            <form className="data-manager-container" onSubmit={handleRegister}>
                <div className="color-area">
                    <div className="blue-area-content">
                        <h3 className="title">{info.title_component}</h3>
                        <i onClick={closeNodeFunc} className="fas fa-times"></i>
                    </div>
                </div>
                <div className="data-section">
                    {
                        info.pic === true && <ImageUploading multiple value={image} onChange={handleImageInput} maxNumber={1} dataURLKey="data_url" acceptType={["jpg", "png"]}>
                            {
                                (
                                    {
                                        onImageUpload,
                                        dragProps
                                    }
                                ) => (
                                    <div className={info.pic && "profile-pic"} onClick={onImageUpload} {...dragProps}>
                                        {
                                            image.length > 0 ? <img className="image-container" src={image[0].data_url} /> : info.image ? <img className="image-container" src={info.image} /> : <img className="image-container" src="assets/default.png" />
                                        }
                                        <div className="upload-icon">
                                            <div className="blue-area">
                                                <i className="fas fa-camera"></i>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        </ImageUploading>
                    }
                    {
                        <ModalInputComponent inputs={info.data_fields} />
                    }
                </div>
                <div className="more-data-section">
                    {
                        moreInfo && <ModalInputComponent inputs={moreInfo} />
                    }
                </div>
                <div className='scroll-data'>
                    <div className='scroll-data-row'>
                        {
                            scrollData && <div className='container-inputs'>
                                <ModalInputComponent inputs={scrollData} />
                            </div>
                        }
                        {
                            channel && channel.map((item, i) => {
                                return (
                                    <div className='container-inputs' key={i}>
                                        <ModalInputComponent inputs={item} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={error ? "error-msg active-msg" : "error-msg"}>{errorMsg}</div>
                <div className="btn-container">
                    <Button dataBtn={activeBtn} />
                </div>
            </form >
        </div >
    )
}

export default DataManager;