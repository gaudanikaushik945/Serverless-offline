export interface IUser {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface IGitHubRepo {
    name: string;
    description: string;
    homepage?: string;
    private: boolean;
    has_issues:boolean,
    has_projects:boolean,
    has_wiki:boolean
}
