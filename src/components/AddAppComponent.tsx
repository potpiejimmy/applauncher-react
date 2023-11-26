import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { AppContext } from '../services/AppService';

interface AddAppState {
    selectedTab: number;
}

export default class AddAppComponent extends React.Component<any,AddAppState> {

    inpfilter = React.createRef<HTMLInputElement>();
    inpurl = React.createRef<HTMLInputElement>();
    inpfolder = React.createRef<HTMLInputElement>();

    indexedInputs = [ this.inpfilter, this.inpurl, this.inpfolder ];

    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    constructor(props: any) {
        super(props);
        this.state = {
            selectedTab: 0
        }
    }

    componentDidMount() {
        this.setDelayedFocus(this.inpfilter);
    }

    setDelayedFocus(inputRef: React.RefObject<HTMLInputElement>) {
        setTimeout(()=>inputRef.current?.focus(), 250);
    }

    tabChanged(event: React.SyntheticEvent, newTab: number) {
        this.setState({selectedTab: newTab})
        this.setDelayedFocus(this.indexedInputs[newTab]);
    }

    render() {
        let app = this.context;
        return (
            <div>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={this.state.selectedTab} onChange={(e,v)=>this.tabChanged(e,v)}>
                        <Tab label="Add Community App"/>
                        <Tab label="Add Custom App"/>
                        <Tab label="Add Folder"/>
                    </Tabs>
                    <div role="tabpanel" hidden={this.state.selectedTab!=0}>
                        <Box className="p-5 flex flex-col gap-5" >
                            <TextField inputRef={this.inpfilter} label="Quick filter" helperText="Filter by name or URL"></TextField>
                        </Box>
                    </div>
                    <div role="tabpanel" hidden={this.state.selectedTab!=1}>
                        <Box className="p-5 flex flex-col gap-5" >
                            <TextField inputRef={this.inpurl} label="Enter custom URL"></TextField>
                        </Box>
                    </div>
                    <div role="tabpanel" hidden={this.state.selectedTab!=2}>
                        <Box className="p-5 flex flex-col gap-5" >
                            <TextField inputRef={this.inpfolder} label="Enter folder name"></TextField>
                        </Box>
                    </div>
                </Box>
            </div>
        )
    }
}
