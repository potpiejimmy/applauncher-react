export default class AppService {

    constructor(
        public platformDarkMode: boolean,
        public setPlatformDarkMode: React.Dispatch<React.SetStateAction<boolean>>) {
    }

    toggleTheme() {
        this.setPlatformDarkMode(this.platformDarkMode !== true);
    }
}
