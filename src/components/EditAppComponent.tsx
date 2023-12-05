import React from 'react';
import { AppContext } from '../services/AppService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface EditAppProps {
}
interface EditAppState {
}

export default class EditAppComponent extends React.Component<EditAppProps,EditAppState> {

    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    constructor(
        props: EditAppProps) {

        super(props);
    }

    get app() {
        return this.context;
    }

    get editingApp(): any {
        return this.app?.state.editingApp;
    }

    get label(): string {
        return this.editingApp?.name;
    }

    set label(label: string) {
        this.app?.setState({editingApp: { ...this.editingApp, name: label }});
    }

    get url(): string {
        return this.editingApp?.url;
    }

    set url(url: string) {
        this.app?.setState({editingApp: { ...this.editingApp, url: url }});
    }

    get icon(): string {
        return this.editingApp?.icon;
    }

    set icon(icon: string) {
        this.app?.setState({editingApp: { ...this.editingApp, icon: icon }});
    }

    get folderId(): any {
        return this.app?.state.editingAppFolderId;
    }

    set folderId(folderId: any) {
        this.app?.setState({editingAppFolderId: folderId});
    }

    render() {
        
        return (
            <Dialog open={this.editingApp != null}
                    onClose={()=>this.app?.closeDialogs()}
                    onKeyUp={e => e.key === 'Enter' && this.app?.updateCurrentApp()}
                    scroll="paper"
                    classes={{ scrollPaper: '!items-start' }}>
                <DialogContent className='w-[32rem] flex flex-col gap-3'>
                    <TextField
                        autoFocus
                        value={this.label}
                        onChange={e => this.label = e.currentTarget.value}
                        id="label"
                        label="Label"
                        fullWidth variant="standard"
                    />
                    {!this.app?.isFolder(this.editingApp) &&
                        <TextField
                            value={this.url}
                            onChange={e => this.url = e.currentTarget.value}
                            id="url"
                            label="URL"
                            fullWidth variant="standard"
                        />
                    }
                    {!this.app?.isFolder(this.editingApp) &&
                        <TextField
                            value={this.icon}
                            onChange={e => this.icon = e.currentTarget.value}
                            id="icon"
                            label="Icon"
                            fullWidth variant="standard"
                        />
                    }
                    {!this.app?.isFolder(this.editingApp) &&
                        <FormControl variant="standard">
                            <InputLabel>Folder</InputLabel>
                            <Select
                                    value={this.folderId}
                                    onChange={e => this.folderId = e.target.value}
                                    id="folder"
                                    label="Folder"
                                    fullWidth variant="standard">
                                <MenuItem value="root"><em>&lt;Root folder&gt;</em></MenuItem>
                                {this.app?.getFolders().map(f => 
                                    <MenuItem value={f.id}>{f.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    }
                    {this.app?.isFolder(this.editingApp) &&
                        <div>Note: Deleting a folder also deletes all apps in the folder.</div>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>this.app?.updateCurrentApp()}>OK</Button>
                    <Button onClick={()=>this.app?.closeDialogs()}>Cancel</Button>
                    <div className='flex grow'/>
                    <Button onClick={()=>this.app?.removeCurrentApp()}>Delete</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

