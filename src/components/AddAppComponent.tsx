import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { AppContext } from '../services/AppService';

interface AddAppState {
    selectedTab: number;
}

export default class AddAppComponent extends React.Component<any,AddAppState> {

    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    constructor(props: any) {
        super(props);
        this.state = {
            selectedTab: 0
        }
    }

    render() {
        let app = this.context;
        return (
            <div>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={this.state.selectedTab} onChange={(e,v)=>this.setState({selectedTab: v})}>
                        <Tab label="Add Community App"/>
                        <Tab label="Add Custom App"/>
                        <Tab label="Add Folder"/>
                    </Tabs>
                </Box>
            </div>
        )
    }
}
