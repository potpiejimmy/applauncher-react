import React from 'react';
import { useDrag, useDrop } from 'react-dnd'
import { AppContext } from "../services/AppService";
import Card from '@mui/material/Card';
import EditAttributesIcon from '@mui/icons-material/Sort';
import FolderIcon from '@mui/icons-material/FolderOutlined'
import { useTheme } from '@mui/material/styles';

export default function PwaLauncher({ pwa }: any) {

    const theme = useTheme();
    const app = React.useContext(AppContext);

    /* the following is for touch devices only */
    const [dragProps, drag] = useDrag(() => ({
        type: 'app',
        item: pwa
    }))

    const [dropProps, drop] = useDrop(() => ({
          accept: 'app',
          drop: item => app?.appDropped(item, pwa),
          canDrop: ()=> app!=null && app.state.editing
    }))
    /* end react-dnd */

    return (

        <Card className="w-48 h-32"
              sx={{':hover': { boxShadow: theme.shadows[5] }}}
              onClick={e=>app?.onAppClicked(pwa, e.currentTarget)}
              ref={drag} /* react-dnd for touch */
              draggable={app?.state.editing}
              onDragStart={()=>app && (app.draggingApp = pwa)}
              onDragEnd={()=>app && (app.draggingApp = null)}
              onDragOver={e=>e.preventDefault()}
              onDrop={(e)=>app?.appDropped(app.draggingApp, pwa)}>

            {app?.state.editing && <div className="z-10 absolute ml-40"><EditAttributesIcon/></div>}
            {app?.isFolder(pwa) && <div className="z-10 absolute ml-1"><FolderIcon/></div>}

            <div ref={drop} /* react-dnd for touch */ className="h-full p-3 flex flex-col items-center justify-center gap-5">
                {!app?.isFolder(pwa) &&
                    <img draggable="false" width="48" height="48" src={pwa.icon} onError={e=>e.currentTarget.src='./www.png'}/>
                }
                {app?.isFolder(pwa) &&
                    <div className="flex flex-wrap flex-start items-start justify-start w-[48px] h-[48px]">
                        {pwa.apps.slice(0,4).map((a:any) =>
                            <img draggable="false" key={a.id} width="24" height="24" src={a.icon}/>
                        )}
                    </div>
                }
                <div className="w-full text-center whitespace-nowrap overflow-hidden">{pwa.name}</div>
            </div>
        </Card>

    );
}
