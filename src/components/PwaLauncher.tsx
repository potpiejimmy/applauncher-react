import React from 'react';
import { AppContext } from "../services/AppService";
import Card from '@mui/material/Card';
import EditAttributesIcon from '@mui/icons-material/ModeEditOutlined';
import { useTheme } from '@mui/material/styles';

export default function PwaLauncher({ pwa }: any) {

    const theme = useTheme();
    const app = React.useContext(AppContext);

    return (

        <Card key={pwa.id} className="w-48 h-32" sx={{':hover': { boxShadow: theme.shadows[5] }}} onClick={()=>app?.onAppClicked(pwa)}>
            {app?.state.editing && <div className="z-10 absolute ml-40"><EditAttributesIcon></EditAttributesIcon></div>}
            <div className="h-full p-3 flex flex-col items-center justify-center gap-5">
                <img width="48" height="48" src={pwa.icon} onError={
                    e=>e.currentTarget.src='./www.png'
                }/>
                <div className="w-full text-center whitespace-nowrap overflow-hidden">{pwa.name}</div>
            </div>
        </Card>

    );
}
