import React from 'react';
import { AppContext } from '../services/AppService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface EditAppProps {
}

export default class EditAppComponent extends React.Component<EditAppProps,any> {

    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    constructor(
        props: EditAppProps) {

        super(props);
    }

    get app() {
        return this.context;
    }

    get open(): boolean {
        return this.editingApp;
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

    render() {
        
        return (
            <Dialog open={this.open}
                    onClose={()=>this.app?.closeDialogs()}
                    onKeyUp={e => e.key === 'Enter' && this.app?.updateCurrentApp()}
                    scroll="paper"
                    classes={{ scrollPaper: '!items-start' }}>
                <DialogTitle>Edit</DialogTitle>
                <DialogContent className='w-96 flex flex-col gap-3'>
                    <TextField
                        autoFocus
                        value={this.label}
                        onChange={e => this.label = e.currentTarget.value}
                        id="label"
                        label="Label"
                        fullWidth variant="standard"
                    />
                    <TextField
                        value={this.url}
                        onChange={e => this.url = e.currentTarget.value}
                        id="url"
                        label="URL"
                        fullWidth variant="standard"
                    />
                    <TextField
                        value={this.icon}
                        onChange={e => this.icon = e.currentTarget.value}
                        id="icon"
                        label="Icon"
                        fullWidth variant="standard"
                    />
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

