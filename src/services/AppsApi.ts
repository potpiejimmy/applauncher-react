import HttpBase from "./HttpBase";

export default class AppsApi extends HttpBase{

    async getCommunityApps(): Promise<any> {
        return this.get("/apps/community");
    }

    async getAppInfo(data: any): Promise<any> {
        return this.post("/apps", data);
    }

    async backupApps(id: string, data: any): Promise<any> {
        return this.post("/backup", {
                id: id,
                data: data
            });
    }

    async restoreApps(id: string, remove: boolean): Promise<any> {
        return this.get("/backup/"+encodeURIComponent(id)+(remove?"?delete=1":""));
    }
}
