import { Routes } from '@angular/router';
import { Dashboard } from './dashboard';
import { ROUTING_TERMS } from './statics';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { reducers } from '../../store';
import { UsersEffects } from '../../store/users/users.effects';
import { Users } from '../users/users';



export const dashboardRoutes: Routes = [
    {
        path: '',
        component: Dashboard,
        providers: [
            provideState('users', reducers.users),
            provideEffects(UsersEffects),
        ],
        children: [
            {
                path: '',
                redirectTo: ROUTING_TERMS.USERS,
                pathMatch: 'full'
            },
            {
                path: 'users',
                component: Users
            }
        ]
    },
];

