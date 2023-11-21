import React from 'react';
import Button from '@mui/material/Button';
import { AppContext } from '../services/AppService';

export default function DummyComponent() {

    const app = React.useContext(AppContext);

    return (
        <Button variant="contained" onClick={()=>app?.toggleMode()}>{app?.state.mode}</Button>
    )
}
