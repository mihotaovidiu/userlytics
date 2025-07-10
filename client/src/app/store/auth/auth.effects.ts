import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { AuthService } from '../../shared/services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
    private actions$ = inject(Actions);
    private authService = inject(AuthService);
    private router = inject(Router);

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap(({ email, password }) =>
                this.authService.login({ email, password }).pipe(
                    map((result) => AuthActions.loginSuccess({ user: result.user, access_token: result.access_token })),
                    tap((result) => {
                        if (result && result.access_token) {
                            localStorage.setItem('auth_token', result.access_token);
                            this.router.navigate(['/']);
                        }
                    }),
                    catchError((httpError) => {
                        return of(AuthActions.loginFailure({ error: httpError.error ? httpError.error : httpError }))
                    }))
            )
        )
    );

    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.register),
            mergeMap(({ name, email, password }) =>
                this.authService.register({ name, email, password }).pipe(
                    map((result) => AuthActions.registerSuccess({ user: result.user, access_token: result.access_token })),
                    tap((result) => {
                        if (result && result.access_token) {
                            localStorage.setItem('auth_token', result.access_token);
                            this.router.navigate(['/']);
                        }
                    }),
                    catchError((httpError) => {
                        return of(AuthActions.registerFailure({ error: httpError.error ? httpError.error : httpError }))
                    })
                )
            )
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            tap(() => {
                localStorage.removeItem('auth_token');
                this.router.navigate(['/auth']);
            })
        ),
        { dispatch: false }
    );

    whoami$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ROOT_EFFECTS_INIT, AuthActions.whoami),
            mergeMap(() =>
                this.authService.whoami().pipe(
                    map(user => AuthActions.whoamiSuccess({ user })),
                    catchError(httpError => of(AuthActions.whoamiFailure({ error: httpError.error ? httpError.error : httpError })))
                )
            )
        )
    );
}
