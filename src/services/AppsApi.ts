export default class AppsApi {

    requestOptions() {
        return { headers: {
            "Content-Type": "application/json"
        } };
    }

    async handleResponse(response: Promise<Response>): Promise<any> {
        return new Promise<any>(async (resolve,reject) => {
            let res = await response;
            let body = await res.json();
            if (!res.status || res.status >= 400) {
                let error = body.error.message || body.message || body;
                reject(JSON.stringify(error) || "HTTP error")
            }
            resolve(body);
        })
    }

    async getCommunityApps(): Promise<any> {
        return this.handleResponse(fetch(process.env.REACT_APP_API_URL + "/apps/community", this.requestOptions()));
    }

    async getAppInfo(data: any): Promise<any> {
        return this.handleResponse(fetch(process.env.REACT_APP_API_URL + "/apps", {
            ...this.requestOptions(),
            method: 'POST',
            body: JSON.stringify(data)
        }));
    }
}
