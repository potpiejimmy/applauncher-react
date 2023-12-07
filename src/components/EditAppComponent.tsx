import React from 'react';
import { AppContext } from '../services/AppService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FolderIcon from '@mui/icons-material/FolderOutlined'

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
                <div className="mx-3 w-[30rem] flex flex-col gap-2">
                    <div className="p-3">
                        <div className="flex flex-col gap-3">
                            <TextField
                                autoFocus
                                value={this.label}
                                onChange={e => this.label = e.currentTarget.value}
                                id="label"
                                label="Label"
                                fullWidth variant="standard"
                            />
                            {this.editingApp && !this.app?.isFolder(this.editingApp) &&
                                <TextField
                                    value={this.url}
                                    onChange={e => this.url = e.currentTarget.value}
                                    id="url"
                                    label="URL"
                                    fullWidth variant="standard"
                                />
                            }
                            {this.editingApp && !this.app?.isFolder(this.editingApp) &&
                                <TextField
                                    value={this.icon}
                                    onChange={e => this.icon = e.currentTarget.value}
                                    id="icon"
                                    label="Icon"
                                    fullWidth variant="standard"
                                    helperText="Customize the icon by using any external icon URL here"
                                />
                            }
                        </div>
                    </div>
                    {this.editingApp && !this.app?.isFolder(this.editingApp) &&
                        <fieldset className="border border-gray-400 px-3 pb-3">
                            <legend className="p-1 text-sm"><FolderIcon/> Move to Folder</legend>
                            <Select
                                    value={this.folderId}
                                    onChange={e => this.folderId = e.target.value}
                                    id="folder"
                                    label="Folder"
                                    fullWidth variant="standard">
                                <MenuItem value="root"><em>&lt;Root folder&gt;</em></MenuItem>
                                {this.app?.getFolders().map(f => 
                                    <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
                                )}
                            </Select>
                        </fieldset>
                    }
                    {this.app?.isFolder(this.editingApp) &&
                        <div className="p-3">Note: Deleting a folder also deletes all apps in the folder.</div>
                    }
                    <div className="p-3">
                        Note: To change the order of apps and folders, simply drag on the screen.
                    </div>
                </div>
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

