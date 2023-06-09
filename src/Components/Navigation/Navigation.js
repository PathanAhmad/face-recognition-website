import React from 'react';

const Navigation = ({onRouteChange, setInitial}) => {
    return(
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
            <p className='f3 link dim black underline pa3 pointer' onClick = {() => {onRouteChange('signin'); setInitial()}} >Sign out</p>
        </nav>
    )
}

export default Navigation;