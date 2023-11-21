import React from 'react';

export class AppService {

    modes = ['Light','Dark','Auto'];

    constructor(
        public mode: string,
        public setMode: React.Dispatch<React.SetStateAction<string>>) {
    }

    toggleMode() {
        let ix = this.modes.indexOf(this.mode);
        this.setMode(this.modes[(ix + 1) % 3]);
        //this.save();
    }

    darkMode(): boolean {
        if (this.mode == 'Auto') {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            return this.mode == 'Dark';
        }
    }
}

export const AppContext = React.createContext<AppService|null>(null);
