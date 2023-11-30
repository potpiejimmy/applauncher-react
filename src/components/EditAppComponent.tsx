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

    inplabel = React.createRef<HTMLInputElement>();
    inpurl = React.createRef<HTMLInputElement>();
    inpicon = React.createRef<HTMLInputElement>();

    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    constructor(props: EditAppProps) {
        super(props);
    }

    get app() {
        return this.context;
    }

    get open(): boolean {
        return this.app && this.app.state.editingApp;
    }

    render() {
        
        return (
            <Dialog open={this.open} onClose={()=>this.app?.closeDialogs()} scroll="paper" classes={{ scrollPaper: '!items-start' }}>
                <DialogTitle>Edit</DialogTitle>
                <DialogContent className='w-96'>
                    <TextField
                        autoFocus
                        inputRef={this.inplabel}
                        margin="dense"
                        id="label"
                        label="Label"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>this.app?.closeDialogs()}>OK</Button>
                    <Button onClick={()=>this.app?.closeDialogs()}>Cancel</Button>
                    <div className='flex grow'/>
                    <Button onClick={()=>this.app?.removeApp(this.app.state.editingApp)}>Delete</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

