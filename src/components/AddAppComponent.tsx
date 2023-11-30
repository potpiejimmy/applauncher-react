import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';

import { v4 as uuid } from 'uuid';

import { AppContext } from '../services/AppService';

interface AddAppState {
    selectedTab: number;
    communityApps: any;
    loading: boolean;
    filter: string;
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
            selectedTab: 0,
            communityApps: [],
            loading: false,
            filter: ''
        }
    }

    componentDidMount() {
        this.setDelayedFocus(this.inpfilter);
        this.loadCommunityApps();
    }

    get app() {
        return this.context;
    }

    async loadCommunityApps() {
        this.setState({loading: true});
        try {
            let apps = await this.app?.api.getCommunityApps();
            this.setState({communityApps: apps});
        } catch (err) {
            // maybe show something here
        }
        this.setState({loading: false});
    }

    setDelayedFocus(inputRef: React.RefObject<HTMLInputElement>) {
        setTimeout(()=>inputRef.current?.focus(), 250);
    }

    tabChanged(event: React.SyntheticEvent, newTab: number) {
        this.setState({selectedTab: newTab})
        this.setDelayedFocus(this.indexedInputs[newTab]);
    }

    get communityAppsFiltered(): any {
        let lowfilter = this.state.filter.toLowerCase();
        return this.state.communityApps.filter((c:any) => 
            c.name.toLowerCase().indexOf(lowfilter)>=0 ||
            c.url.toLowerCase().indexOf(lowfilter)>=0);
    }

    async selectedCommunityApp(app: any) {
        // simply copy community app:
        let appInfo = JSON.parse(JSON.stringify(app));
        console.log("ADDING: " + JSON.stringify(app));
        appInfo.id = uuid();
        this.app?.addApp(appInfo);
        this.app?.closeDialogs();
    }

    render() {
        return (
            <div>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={this.state.selectedTab} onChange={(e,v)=>this.tabChanged(e,v)}>
                        <Tab label="Community App"/>
                        <Tab label="Custom App"/>
                        <Tab label="Folder"/>
                    </Tabs>
                    <div role="tabpanel" hidden={this.state.selectedTab!=0}>
                        <Box className="p-5 flex flex-col gap-5" >
                            <TextField inputRef={this.inpfilter}
                                       label="Quick filter"
                                       helperText="Filter by name or URL"
                                       value={this.state.filter} 
                                       onChange={e=>this.setState({filter: e.target.value})}>
                            </TextField>
                            <div className="flex flex-col gap-1 text-sm">
                                Found {this.communityAppsFiltered.length} of {this.state.communityApps.length} community apps
                                {this.communityAppsFiltered.map((a:any) =>
                                    <Card key={a.url} onClick={()=>this.selectedCommunityApp(a)}>
                                        <div className="p-3 flex flex-row items-center gap-5">
                                            <img width="32" height="32" src={a.icon} onError={
                                                e=>e.currentTarget.src='./www.png'
                                            }/>
                                            <div className="flex flex-col">
                                                <div>{a.name}</div>
                                                <div className="text-xs">{a.url}</div>
                                            </div>
                                        </div>
                                    </Card>
                                )}
                            </div>
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
                    {this.state.loading && <LinearProgress/>}
                </Box>
            </div>
        )
    }
}
