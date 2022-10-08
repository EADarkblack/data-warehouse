// Libraries

import { useContext } from 'react';
import PropTypes from 'prop-types';

// Components

import Button from '../Button/Button';
import Select from '../Select/Select';
import { ModalDataInputContext } from '../../context/ModalDataInputContext';
import { ButtonContext } from '../../context/ButtonContext';
import { DataContext } from '../../context/DataContext';

// Style

import './ModalInputComponent.css';

// Functions

const ModalInputComponent = ({ inputs }) => {

    /**
     * States and Contexts to handle the data.
     */

    const { inputData, setInputData } = useContext(ModalDataInputContext);

    const { setActiveBtn } = useContext(ButtonContext);

    const { setCloseNode } = useContext(DataContext);

    /**
     * 
     * @param {*} e - Event used to get the value and the name of every input.
     * This function allows to change the style of the save button when the user selects the right information.
     */

    const handleInput = (e) => {
        setInputData({
            ...inputData,
            [e.target.name]: e.target.value
        })
        e.target.value.length > 0 ? setActiveBtn(btnConfig.btn_active) : setActiveBtn(btnConfig.btn);
    }

    /**
     * Allows close the "Data Manager" window on the app.
     */

    const closeNodeFunc = () => {
        setCloseNode("data-manager-bg");
        setInputData({});
    }

    /**
     * Object used to show the save's button and cancel's button on the modal.
     */

    const btnConfig = {
        btn_active:
            [
                {
                    class: "cancel cancel-active",
                    text: "Cancelar",
                    func: closeNodeFunc
                },
                {
                    class: "save-user active-save",
                    text: "Guardar cambios",
                    type: "submit"
                }
            ],
        btn:
            [
                {
                    class: "cancel",
                    text: "Cancelar",
                    type: "button"
                },
                {
                    class: "save-user",
                    text: "Guardar cambios",
                    type: "button"
                }
            ]
    }

    return (
        <>
            {
                inputs.map((item, i) => {
                    if (item.type === "select") {
                        return (
                            <Select data={item} key={i} />
                        )
                    } else if (item.type === "text") {
                        return (
                            <label className="data-input" key={i}>
                                <div className="title-input">{item.title}<span>{item.require ? "*" : ""}</span></div>
                                <div className="input-container no-active">
                                    <input onChange={handleInput} className="input" type={item.type} name={item.name} disabled={item.disable} placeholder={item.value ? item.value : ""} />
                                </div>
                            </label>
                        )
                    } else {
                        return (
                            <Button dataBtn={item.btn} key={i} />
                        )
                    }
                })
            }
        </>
    )
}

// Props

ModalInputComponent.propTypes = {
    inputs: PropTypes.array
}

export default ModalInputComponent;