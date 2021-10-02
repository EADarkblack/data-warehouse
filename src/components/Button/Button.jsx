// Libraries

import React from 'react';

// Functions

const Button = ({dataBtn}) => {
    return (
        <>
            {
                dataBtn.map((item) => (
                    <button onClick={item.func} className={item.class} key={item.text}>{item.text}</button>
                ))
            }
        </>
    )
}

export default Button;

