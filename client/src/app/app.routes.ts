import { Routes } from '@angular/router';
import { GuestGuard, AuthGuard } from './shared/shared-guards';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        canActivate: [GuestGuard],
        loadChildren: () =>
            import('./features/authentication/authentication.routes')
                .then(m => m.authenticationRoutes),
    },
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./features/dashboard/dashboard.routes')
                .then(m => m.dashboardRoutes),
    }
];
