import { Routes } from '@angular/router';
import { Authentication } from './authentication';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { reducers } from '../../store';
import { AuthEffects } from '../../store/auth/auth.effects';

export const authenticationRoutes: Routes = [
    {
        path: '',
        component: Authentication,
        providers: [
            provideState('auth', reducers.auth),
            provideEffects(AuthEffects),
        ]
    },
];
