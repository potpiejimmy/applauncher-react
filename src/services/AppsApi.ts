export default class AppsApi {

    requestOptions() {
        return { headers: {
            "Content-Type": "application/json"
        } };
    }

    getCommunityApps(): Promise<any> {
        return fetch("https://api.applauncher.site/apps/community", this.requestOptions())
            .then(res => res.json());
    }
}
