import React from 'react';
import AppsApi from './AppsApi';

interface AppState {
    apps: Array<any>;
    currentApps: Array<any>;
    currentFolder: any;
    mode: string;
    snackbarOpen: boolean;
    anchorAdd: any;
}

export class AppService extends React.Component<any,AppState> {

    modes = ['Light','Dark','Auto'];
    api = new AppsApi();

    constructor(props: any) {
        super(props);
        this.state = {
            apps: [],
            currentApps: [],
            currentFolder: null,
            mode: 'Auto',
            snackbarOpen: false,
            anchorAdd: null
        };
    }

    load() {
        //let storedApps = localStorage.getItem("apps");
        //if (storedApps) this.apps = JSON.parse(storedApps);
        let mode = localStorage.getItem("mode");
        if (mode) this.setState({mode: mode});
    }

    save() {
        //localStorage.setItem("apps", JSON.stringify(this.apps));
        localStorage.setItem("mode", this.state.mode);
    }

    toggleMode() {
        let ix = this.modes.indexOf(this.state.mode);
        let mode = this.modes[(ix + 1) % 3];
        this.setState({mode: mode, snackbarOpen: false});
        this.openSnackbar();
    }

    openSnackbar() {
        setTimeout(()=>this.setState({snackbarOpen: true}), 100);
    }

    get darkMode(): boolean {
        if (this.state.mode == 'Auto') {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            return this.state.mode == 'Dark';
        }
    }

    get muiMode(): 'light' | 'dark' {
        return this.darkMode ? 'dark' : 'light';
    }
}

export const AppContext = React.createContext<AppService|null>(null);
