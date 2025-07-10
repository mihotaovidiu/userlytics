import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthResponse {
    access_token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: 'user' | 'admin';
    };
}

@Injectable({
    providedIn: 'root',
})
export class AuthApi {
    private baseUrl = '/api/auth';

    constructor(private http: HttpClient) { }

    login(payload: { email: string; password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload);
    }

    register(payload: { name: string; email: string; password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload);
    }

    getCurrentUser(): Observable<AuthResponse['user']> {
        return this.http.get<AuthResponse['user']>(`${this.baseUrl}/whoami`);
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/logout`, {});
    }
}
