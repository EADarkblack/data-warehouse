// Libraries

import React from 'react';
import parser from 'html-react-parser';

// Functions

const Button = ({ dataBtn }) => {
    return (
        <>
            {
                dataBtn.map((item) => (
                    <button onClick={item.func} name={item.name ?? ""} className={item.class} key={item.text} type={item.type}>{parser(item.text)}</button>
                ))
            }
        </>
    )
}

export default Button;