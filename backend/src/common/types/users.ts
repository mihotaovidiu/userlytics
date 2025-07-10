import { Role } from "./role";

export interface UsersQueryFilter {
    page?: number;
    limit?: number;
    search?: string;
}

export type PublicUser = {
    id: number;
    name: string;
    email: string;
    role: Role;
};


export type PublicUserCollection = {
    users: PublicUser[],
    total: number,
    page: number,
    pageSize: number,
};