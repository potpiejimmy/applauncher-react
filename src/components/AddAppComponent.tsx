import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { v4 as uuid } from 'uuid';

import { AppContext } from '../services/AppService';

interface AddAppState {
    selectedTab: number;
    communityApps: any;
    loading: boolean;
    filter: string;
    url: string;
    sensitive: boolean;
    community: boolean;
    folder: string;
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
            filter: '',
            url: 'https://',
            sensitive: false,
            community: false,
            folder: ''
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

    async addFolder() {
        let folder = {
            id: uuid(),
            url: "folder://",
            name: this.state.folder,
            icon: '/assets/appfolder.png',
            apps: []
        };
        this.app?.addApp(folder);
        this.app?.openFolder(folder);
        this.app?.closeDialogs();
    }

    async addCustomApp() {
        this.setState({loading: true});
        try {
            let url = this.state.url;
            console.log("Adding: " + url);
            let appInfo;
            if (this.state.sensitive) {
                appInfo = {
                    id: uuid(),
                    url: url,
                    name: url,
                    icon: '/lock.png'
                }
            } else {
                appInfo = await this.app?.api.getAppInfo({
                    url: url,
                    suggestCommunity: this.state.community
                });
            }
            console.log("RESOLVED: " + JSON.stringify(appInfo));
            this.app?.addApp(appInfo);
            this.app?.closeDialogs();
        } catch (err) {
            this.app?.openSnackbar("Error:" + err);
        } finally {
            this.setState({loading: false, url: "https://"});
        }
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
                                       onChange={e=>this.setState({filter: e.target.value})}/>
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
                            <TextField inputRef={this.inpurl}
                                       label="Enter custom URL"
                                       value={this.state.url}
                                       onChange={e=>this.setState({url: e.target.value})}
                                       disabled={this.state.loading}
                                       onKeyUp={e => e.key === 'Enter' && this.state.url.length>10 && !this.state.loading && this.addCustomApp()}/>
                            <FormGroup>
                                <FormControlLabel control={
                                    <Checkbox checked={this.state.sensitive}
                                              onChange={e=>this.setState({sensitive: e.target.checked})}
                                              disabled={this.state.community}/>
                                } label="Private URL (do not resolve icon and name)" />
                                <FormControlLabel control={
                                    <Checkbox checked={this.state.community}
                                              onChange={e=>this.setState({community: e.target.checked})}
                                              disabled={this.state.sensitive}/>
                                } label="Suggest as a Community App" />
                            </FormGroup>
                            <div className="flex-col">
                                <Button variant="contained"
                                            disabled={this.state.url.length<=10}
                                            onClick={()=>this.addCustomApp()}>
                                        Add App
                                </Button>
                            </div>
                        </Box>
                    </div>
                    <div role="tabpanel" hidden={this.state.selectedTab!=2}>
                        <Box className="p-5 flex flex-col gap-5" >
                            <TextField inputRef={this.inpfolder}
                                       label="Enter folder name"
                                       value={this.state.folder}
                                       onChange={e=>this.setState({folder: e.target.value})}
                                       onKeyUp={e => e.key === 'Enter' && this.state.folder.length && this.addFolder()}/>
                            <div className="flex-col">
                                <Button variant="contained"
                                        disabled={!this.state.folder.length}
                                        onClick={()=>this.addFolder()}>
                                    Create folder
                                </Button>
                            </div>
                            <div>
                                Enable edit mode to move an app to a different folder
                            </div>
                        </Box>
                    </div>
                    {this.state.loading && <LinearProgress/>}
                </Box>
            </div>
        )
    }
}
