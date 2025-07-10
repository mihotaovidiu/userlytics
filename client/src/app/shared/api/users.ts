import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../shared-types';

// Interface for query parameters used in user list requests (pagination, search, etc.)
export interface UsersQueryParams {
    page?: number; // Page number for pagination
    pageSize?: number; // Number of users per page
    search?: string; // Search string for filtering users
    [key: string]: any; // Additional filter parameters
}

@Injectable({ providedIn: 'root' })
export class UsersApiService {
    // Base URL for user API endpoints
    private readonly apiUrl = '/api/users';

    constructor(private http: HttpClient) { }

    /**
     * Get a paginated and/or filtered list of users.
     * @param params Query parameters for pagination, search, and filters
     */
    getUsers(params: UsersQueryParams = {}): Observable<User[]> {
        let httpParams = new HttpParams();
        if (params.page !== undefined) httpParams = httpParams.set('page', params.page);
        if (params.pageSize !== undefined) httpParams = httpParams.set('pageSize', params.pageSize);
        if (params.search) httpParams = httpParams.set('search', params.search);
        // Add any additional params
        Object.keys(params).forEach(key => {
            if (!['page', 'pageSize', 'search'].includes(key) && params[key] !== undefined) {
                httpParams = httpParams.set(key, params[key]);
            }
        });
        return this.http.get<User[]>(this.apiUrl, { params: httpParams });
    }

    /**
     * Get a single user by ID.
     * @param id User ID
     */
    getUser(id: number | string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create a new user.
     * @param user User data to create
     */
    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    /**
     * Update an existing user by ID.
     * @param id User ID
     * @param user Updated user data
     */
    updateUser(id: number | string, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    }

    /**
     * Delete a user by ID.
     * @param id User ID
     */
    deleteUser(id: number | string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
