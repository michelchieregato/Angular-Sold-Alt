export class User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    groups: [string];

    constructor(userInfo: any) {
        this.id = userInfo.id;
        this.username = userInfo.username;
        this.first_name = userInfo.first_name;
        this.last_name = userInfo.last_name;
        this.groups = userInfo.groups;
    }
}
