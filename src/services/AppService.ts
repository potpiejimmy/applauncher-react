import React from 'react';

export class AppService {

    constructor(
        public platformDarkMode: boolean,
        public setPlatformDarkMode: React.Dispatch<React.SetStateAction<boolean>>) {
    }

    toggleTheme() {
        this.setPlatformDarkMode(this.platformDarkMode !== true);
    }
}

export const AppContext = React.createContext<AppService|null>(null);
