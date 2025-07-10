import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../../store/auth/auth.selectors';
import { map, take } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private store: Store, private router: Router) { }

    canActivate() {
        return this.store.select(selectAuthUser).pipe(
            take(1),
            map(user => {
                if (user) {
                    return true;
                } else {
                    this.router.navigate(['/auth']);
                    return false;
                }
            })
        );
    }
}