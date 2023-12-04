import React from 'react';
import AppsApi from './AppsApi';

interface AppState {
    apps: Array<any>;
    currentApps: Array<any>;
    currentFolder: any;
    mode: string;
    snackbarOpen: boolean;
    editingApp: any;
    editing: boolean;
    anchorAdd: any;
}

export class AppService extends React.Component<any,AppState> {

    modes = ['Light','Dark','Auto'];
    api = new AppsApi();

    constructor(props: any,
        public snackbarText: string) {

        super(props);
        let apps:any = [];
        this.state = {
            apps: apps,
            currentApps: apps,
            currentFolder: null,
            mode: 'Auto',
            snackbarOpen: false,
            editingApp: null,
            editing: false,
            anchorAdd: null
        };
    }

    load() {
        let storedApps:any = localStorage.getItem("apps");
        let apps:any = JSON.parse(storedApps);
        if (storedApps) this.setState({
            apps: apps,
            currentApps: apps
        });
        let mode = localStorage.getItem("mode");
        if (mode) this.setState({mode: mode});
    }

    save() {
        localStorage.setItem("apps", JSON.stringify(this.state.apps));
        localStorage.setItem("mode", this.state.mode);
    }

    toggleMode() {
        let ix = this.modes.indexOf(this.state.mode);
        let mode = this.modes[(ix + 1) % 3];
        this.setState({mode: mode, snackbarOpen: false});
        this.openSnackbar(mode == 'Auto' ? 'Automatic dark/light mode activated' : mode + " mode activated");
    }

    openSnackbar(text: string) {
        this.snackbarText = text;
        setTimeout(()=>this.setState({snackbarOpen: true}), 100);
    }

    toggleEditMode() {
        let editing = !this.state.editing;
        this.setState({editing: editing});
        this.openSnackbar("Edit mode " + (editing ? 'enabled' : 'disabled'));
    }

    closeDialogs() {
        this.setState({
            editingApp: null,
            anchorAdd: null
        })
    }

    isFolder(app: any): boolean {
        return app.url === 'folder://';
    }

    findAppIndex(app: any): number {
        let found = this.state.currentApps.findIndex(i => i.id == app.id);
        if (found < 0) {
            // fallback, search for same url (downward compatibility if no ID set)
            found = this.state.currentApps.findIndex(i => i.url == app.url);
        }
        return found;
    }

    addApp(app: any) {
        if (this.isFolder(app)) {
            // for now, do not allow folders in folder
            //this.closeFolderImmediate();
        }
        this.state.currentApps.push(app);
        this.setState({currentApps: this.state.currentApps});
        this.save();
    }

    removeCurrentApp() {
        let ix = this.findAppIndex(this.state.editingApp);
        if (ix >= 0) this.state.currentApps.splice(ix,1);
        this.updateApps();
    }

    updateCurrentApp() {
        let ix = this.findAppIndex(this.state.editingApp);
        if (ix >= 0) this.state.currentApps[ix] = this.state.editingApp;
        this.updateApps();
    }

    updateApps() {
        this.setState({currentApps: this.state.currentApps, editingApp: null});
        this.save();
    }

    onAppClicked(app: any) {
        if (this.state.editing) {
            this.setState({editingApp: app})
        } else {
            if (this.isFolder(app)) {
                //this.openFolder(this.app);
            } else {
                window.location.href = app.url;
            }
        }
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
