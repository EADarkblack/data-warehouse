// Libraries

import React from 'react';

// Functions

const DataComponent = ({data}) => {

    /**
     * Takes "profile" and assign a value that can be render on the screen.
     */

    const profile = data.profile ? "Administrador" : "Básico";
    
    return (
        <tr>
            <td>
                <input type="checkbox" />
            </td>
            <td>
                {data.name} {data.last_name}
            </td>
            <td>
                {data.email}
            </td>
            <td>
                {profile}
            </td>
            <td>
                <button>Editar</button>
            </td>
        </tr>
    )
}

export default DataComponent;
