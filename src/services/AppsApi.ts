export default class AppsApi {

    requestOptions() {
        return { headers: {
            "Content-Type": "application/json"
        } };
    }

    getCommunityApps(): Promise<any> {
        return fetch(process.env.REACT_APP_API_URL + "/apps/community", this.requestOptions())
            .then(res => res.json());
    }
}
