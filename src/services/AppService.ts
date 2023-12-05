import React from 'react';
import AppsApi from './AppsApi';

interface AppState {
    apps: Array<any>;
    currentApps: Array<any>;
    currentFolder: any;
    mode: string;
    snackbarOpen: boolean;
    editingApp: any;
    editingAppFolderId: any;
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
            editingAppFolderId: null,
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

    getFolders(): Array<any> {
        return this.state.apps.filter(app => this.isFolder(app));
    }

    isFolder(app: any): boolean {
        return app && app.url === 'folder://';
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
        let currentFolder = this.state.currentFolder;
        let currentApps = this.state.currentApps;
        if (this.isFolder(app)) {
            // for now, do not allow folders in folder
            currentFolder = null;
            currentApps = this.state.apps;
        }
        currentApps.push(app);
        this.updateApps(currentApps, currentFolder);
    }

    removeCurrentApp() {
        let ix = this.findAppIndex(this.state.editingApp);
        if (ix >= 0) this.state.currentApps.splice(ix,1);
        this.updateApps(this.state.currentApps, this.state.currentFolder);
    }

    updateCurrentApp() {
        let currentFolder = this.state.currentFolder;
        let currentApps = this.state.currentApps;

        let ix = this.findAppIndex(this.state.editingApp);
        if (ix >= 0) currentApps[ix] = this.state.editingApp;

        if ((currentFolder?.id || 'root') != this.state.editingAppFolderId) {
            // folder was changed - remove and re-add to new folder:
            currentApps.splice(ix,1);
            if (this.state.editingAppFolderId == 'root') {
                // move to root folder:
                currentFolder = null;
                currentApps = this.state.apps;
            } else {
                currentFolder = this.getFolders().find(i => i.id == this.state.editingAppFolderId);
                currentApps = currentFolder.apps;

            }
            currentApps.push(this.state.editingApp);
        }

        this.updateApps(currentApps, currentFolder);
    }

    updateApps(apps: any, currentFolder: any) {
        this.setState({
            currentApps: apps,
            editingApp: null,
            currentFolder: currentFolder
        });
        this.save();
    }

    onAppClicked(app: any, el: HTMLDivElement) {
        if (this.state.editing) {
            this.editApp(app);
        } else {
            if (this.isFolder(app)) {
                this.openFolder(app, el);
            } else {
                window.location.href = app.url;
            }
        }
    }

    editApp(app: any) {
        this.setState({
            editingApp: app,
            editingAppFolderId: this.state.currentFolder?.id || 'root'
        });
    }

    closeFolderImmediate() {
        if (this.state.currentFolder) {
            this.setState({
                currentFolder: null,
                currentApps: this.state.apps
            });
        }
    }

    openFolder(folder: any, el?: HTMLDivElement) {
        if (el) {
            el.style.animation = "folderAnim .2s linear";
        }
        setTimeout(()=>this.folderOpened(folder), 200);
    }

    folderOpened(folder: any) {
        this.setState({
            currentFolder: folder,
            currentApps: folder.apps
        });
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
