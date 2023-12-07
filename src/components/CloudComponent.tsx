import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import CopyIcon from '@mui/icons-material/ContentCopy';
import PasteIcon from '@mui/icons-material/ContentPaste';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { AppContext } from '../services/AppService';

interface CloudState {
    selectedTab: number;
    backupId: string;
    backupDelete: boolean;
    backupDone: boolean;
    processing: boolean;
}

export default class CloudComponent extends React.Component<any, CloudState> {

    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    constructor(props: any) {
        super(props);

        this.state = {
            selectedTab: 0,
            backupId: localStorage.getItem("backupId") || '',
            backupDelete: false,
            backupDone: false,
            processing: false
        }
    }

    get app() {
        return this.context;
    }

    async backup() {
        this.setState({processing: true});
        try {
            let backupId = (await this.app?.api.backupApps(this.state.backupId, {
                v: 1, /* version */
                apps: this.app?.state.apps
            })).id;
            localStorage.setItem("backupId", backupId);
            this.setState({
                backupId: backupId,
                backupDone: true
            })
        } finally {
            this.setState({processing: false});
        }
    }

    async restore() {
        this.setState({processing: true});
        try {
            let data = await this.app?.api.restoreApps(this.state.backupId, this.state.backupDelete);
            if (data) {
                this.app?.setAllApps(data.apps);
                if (this.state.backupDelete) {
                    this.setState({backupId: ''});
                    localStorage.removeItem("backupId");
                } else {
                    localStorage.setItem("backupId", this.state.backupId);
                }
                this.app?.closeDialogs();
                this.app?.openSnackbar("Successfully restored from cloud.");
            } else {
                this.app?.openSnackbar("Sorry, backup with ID " + this.state.backupId + " not found.");
            }
        } finally {
            this.setState({processing: false});
        }
    }

    render() {
        return (
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={this.state.selectedTab} onChange={(e,v)=>this.setState({selectedTab: v})}>
                    <Tab label="Backup to Cloud"/>
                    <Tab label="Restore From Cloud"/>
                </Tabs>
                <div role="tabpanel" hidden={this.state.selectedTab!=0}>
                    <Box className="p-5 flex flex-col gap-5" >
                        <div>Store your current settings in the cloud to be restored on another device:</div>
                        <div className="flex flex-row gap-3">
                            <TextField label="Your backup ID"
                                    helperText="Backup ID will show up here after backup"
                                    value={this.state.backupId}
                                    disabled={true}/>
                            <IconButton onClick={()=>{
                                navigator.clipboard.writeText(this.state.backupId);
                                this.app?.openSnackbar("Backup ID copied to clipboard");
                            }}>
                                <CopyIcon />
                            </IconButton>
                        </div>
                        <div className="flex flex-row">
                            <Button variant="contained"
                                    disabled={this.state.processing}
                                    onClick={()=>this.backup()}>
                                        Save to cloud
                            </Button>
                        </div>
                        {this.state.backupDone && 
                            <p>Backup was successful. Use the above backup ID to restore on any device.</p>
                        }
                    </Box>
                </div>
                <div role="tabpanel" hidden={this.state.selectedTab!=1}>
                    <Box className="p-5 flex flex-col gap-5" >
                        <div>Restore settings using a backup ID:</div>
                        <div className="flex flex-row gap-3">
                            <TextField label="Enter backup ID"
                                    value={this.state.backupId}
                                    onChange={e=>this.setState({backupId: e.target.value})}
                                    onKeyUp={e => e.key === 'Enter' && this.state.backupId.length && this.restore()}/>
                            <IconButton onClick={async ()=>this.setState({backupId: await navigator.clipboard.readText()})}>
                                <PasteIcon />
                            </IconButton>
                        </div>
                        <FormGroup>
                            <FormControlLabel control={
                                <Checkbox checked={this.state.backupDelete}
                                            onChange={e=>this.setState({backupDelete: e.target.checked})}
                                            disabled={this.state.processing}/>
                            } label="Delete my data from the cloud after restoring" />
                        </FormGroup>
                        <div className="flex flex-row">
                            <Button variant="contained"
                                    disabled={this.state.processing || !this.state.backupId.length}
                                    onClick={()=>this.restore()}>
                                        Restore from cloud
                            </Button>
                        </div>
                        {this.state.backupDone && 
                            <p>Backup was successful. Use the above backup ID to restore on any device.</p>
                        }
                   </Box>
                </div>
                {this.state.processing && <LinearProgress/>}
            </Box>
        )
    }
}