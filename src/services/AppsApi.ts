export default class AppsApi {

    requestOptions() {
        return { headers: {
            "Content-Type": "application/json"
        } };
    }

    async handleResponse(response: Promise<Response>): Promise<any> {
        return new Promise<any>(async (resolve,reject) => {
            let res = await response;
            let body = null;
            try { body = await res.json(); }
            catch (e) { body = null; }
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

    async backupApps(id: string, data: any): Promise<any> {
        return this.handleResponse(fetch(process.env.REACT_APP_API_URL+"/backup", {
            ...this.requestOptions(),
            method: 'POST',
            body: JSON.stringify({
                id: id,
                data: data
            })
        }));
    }

    restoreApps(id: string, remove: boolean): Promise<any> {
        return this.handleResponse(fetch(process.env.REACT_APP_API_URL+"/backup/"+encodeURIComponent(id)+(remove?"?delete=1":"")));
    }
}
