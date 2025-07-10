import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { AuthApi } from '../api/auth';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private authApi: AuthApi) {
    }
    /**
     * Checks if the user is logged in by verifying the presence of a token in localStorage.
     * @returns {boolean} True if the user is logged in, false otherwise.
     */
    isLoggedIn() {
        return !!localStorage.getItem(TOKEN_KEY);
    }

    /**
     * Retrieves the access token from localStorage.
     * @returns {string | null} The access token if it exists, null otherwise.
     */
    getAccessToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    /**
     * Retrieves the current user information from the API.
     * @returns {Observable<any>} An observable containing the user data.
     */
    login(payload: { email: string; password: string }) {
        return this.authApi.login(payload).pipe(
            tap((res: any) => {
                localStorage.setItem(TOKEN_KEY, res.access_token);
            })
        );
    }

    /**
     * Registers a new user with the provided details.
     * @param {Object} payload - The registration details.
     * @param {string} payload.name - The name of the user.
     * @param {string} payload.email - The email of the user.
     * @param {string} payload.password - The password for the user.
     * @returns {Observable<any>} An observable containing the registration response.
     */
    register(payload: { name: string; email: string; password: string }) {
        return this.authApi.register(payload).pipe(
            tap((res: any) => {
                localStorage.setItem(TOKEN_KEY, res.access_token);
            })
        );
    }

    /**
     * Logs out the user by removing the token from localStorage.
     * @returns {Observable<any>} An observable indicating the logout operation.
     */
    logout() {
        return this.authApi.logout().pipe(
            tap((res: any) => {
                localStorage.removeItem(TOKEN_KEY);
            })
        );
    }

    whoami() {
        return this.authApi.getCurrentUser();
    }
}
