import React from 'react';
import AppsApi from './AppsApi';

interface AppState {
    apps: Array<any>;
    currentApps: Array<any>;
    currentFolder: any;
    mode: string;
    systemDarkMode: boolean;
    snackbarOpen: boolean;
    editing: boolean;
    editingApp: any;
    editingAppFolderId: any;
    anchorAdd: any;
    anchorCloud: any;
}

export class AppService extends React.Component<any,AppState> {

    modes = ['Light','Dark','Auto'];
    api = new AppsApi();

    snackbarText: string|null;
    draggingApp: any;

    constructor(props: any) {

        super(props);
        
        this.snackbarText = null;
        this.draggingApp = null;

        let apps:Array<any> = [];
        this.state = {
            apps: apps,
            currentApps: apps,
            currentFolder: null,
            mode: 'Auto',
            systemDarkMode: this.determineSystemDarkMode(true),
            snackbarOpen: false,
            editing: false,
            editingApp: null,
            editingAppFolderId: null,
            anchorAdd: null,
            anchorCloud: null
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
        else mode = this.state.mode;
        this.updateHtmlBackground(mode);
    }

    saveApps(apps: Array<any>) {
        localStorage.setItem("apps", JSON.stringify(apps));
    }

    updateHtmlBackground(mode: string) {
        // update HTML background according to theme
        document.body.style.backgroundColor = this.isEffectiveDarkMode(mode) ? "#111" : "#eee";
    }

    toggleMode() {
        let ix = this.modes.indexOf(this.state.mode);
        let mode = this.modes[(ix + 1) % 3];
        localStorage.setItem("mode", mode);
        this.updateHtmlBackground(mode);
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
            anchorAdd: null,
            anchorCloud: null
        })
    }

    getFolders(): Array<any> {
        return this.state.apps.filter(app => this.isFolder(app));
    }

    isFolder(app: any): boolean {
        return app && app.url === 'folder://';
    }

    findAppIndex(app: any): number {
        if (!app) return -1;
        let found = this.state.currentApps.findIndex(i => i.id == app.id);
        if (found < 0) {
            // fallback, search for same url (downward compatibility if no ID set)
            found = this.state.currentApps.findIndex(i => i.url == app.url);
        }
        return found;
    }

    addApp(app: any) {
        let { currentFolder, currentApps } = this.state;
        if (this.isFolder(app)) {
            // for now, do not allow folders in folder
            currentFolder = null;
            currentApps = this.state.apps;
        }
        currentApps.push(app);
        this.updateApps(this.state.apps, currentApps, currentFolder);
    }

    removeCurrentApp() {
        let ix = this.findAppIndex(this.state.editingApp);
        if (ix >= 0) this.state.currentApps.splice(ix,1);
        this.updateApps(this.state.apps, this.state.currentApps, this.state.currentFolder);
    }

    updateCurrentApp() {
        let { currentFolder, currentApps } = this.state;

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

        this.updateApps(this.state.apps, currentApps, currentFolder);
    }

    updateApps(apps: any, currentApps: any, currentFolder: any) {
        this.setState({
            apps: apps,
            currentApps: currentApps,
            editingApp: null,
            currentFolder: currentFolder
        });
        this.saveApps(apps);
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

    setAllApps(apps: Array<any>): void {
        this.updateApps(apps, apps, null);
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

    appDropped(source: any, target: any) {
        let { currentFolder, currentApps } = this.state;

        let from = this.findAppIndex(source);
        let to = this.findAppIndex(target);

        currentApps[from] = target;
        currentApps[to] = source;
        this.updateApps(this.state.apps, currentApps, currentFolder);
    }

    isEffectiveDarkMode(mode: string) {
        if (mode == 'Auto') {
            return this.determineSystemDarkMode(false);
        } else {
            return mode == 'Dark';
        }
    }

    determineSystemDarkMode(registerChangeListener: boolean): boolean {
        const darkModePreference = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
        if (registerChangeListener) {
            darkModePreference.addEventListener("change", e => {
                this.setState({systemDarkMode: e.matches});
                this.updateHtmlBackground(this.state.mode);
            });
        }
        return darkModePreference.matches;
    }

    get darkMode(): boolean {
        return this.isEffectiveDarkMode(this.state.mode);
    }

    get muiMode(): 'light' | 'dark' {
        return this.darkMode ? 'dark' : 'light';
    }
}

export const AppContext = React.createContext<AppService|null>(null);
