import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private readonly apiUrl = '/api/accounts';

    constructor(private http: HttpClient) { }

    updateUserRole(userId: number, role: 'admin' | 'user'): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${userId}/role`, { role });
    }

    deleteAccount(userId: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${userId}`);
    }
}
