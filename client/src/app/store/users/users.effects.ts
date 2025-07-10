import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersApiService } from '../../shared/api/users';
import { AccountService } from '../../shared/api/account';
import * as UsersActions from './users.actions';
import { catchError, map, mergeMap, of, withLatestFrom, forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../auth/auth.selectors';
import { selectUsersPage, selectUsersPageSize, selectAllUsers } from './users.selectors';

@Injectable()
export class UsersEffects {
    private actions$ = inject(Actions);
    private usersApi = inject(UsersApiService);
    private accountService = inject(AccountService);
    private store = inject(Store);

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.loadUsers),
            mergeMap(({ page, pageSize, search }) =>
                this.usersApi.getUsers({ page, pageSize, search }).pipe(
                    map((response: any) => {
                        // Expecting response: { users: User[], total: number, page: number, pageSize: number }
                        return UsersActions.loadUsersSuccess({
                            users: response.users,
                            total: response.total,
                            page: response.page,
                            pageSize: response.pageSize
                        });
                    }),
                    catchError(error => of(UsersActions.loadUsersFailure({ error })))
                )
            )
        )
    );

    updateUserAndRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.updateUserAndRole),
            withLatestFrom(
                this.store.select(selectAuthUser),
                this.store.select(selectAllUsers)
            ),
            mergeMap(([{ userId, name, role }, authUser, users]) => {
                if (!authUser || authUser.role !== 'admin') {
                    return of(UsersActions.updateUserAndRoleFailure({ error: 'Unauthorized' }));
                }
                const targetUser = users.find(u => u.id === userId);
                if (!targetUser) {
                    return of(UsersActions.updateUserAndRoleFailure({ error: 'User not found' }));
                }
                const nameChanged = name && name !== targetUser.name;
                const roleChanged = role && role !== targetUser.role;
                if (!nameChanged && !roleChanged) {
                    return of(UsersActions.updateUserAndRoleSuccess({ user: targetUser }));
                }
                if (nameChanged && roleChanged) {
                    // Update name, then patch role in result
                    return this.usersApi.updateUser(userId, { ...targetUser, name }).pipe(
                        map(updatedUser => UsersActions.updateUserAndRoleSuccess({ user: { ...updatedUser, role } })),
                        catchError(error => of(UsersActions.updateUserAndRoleFailure({ error })))
                    );
                } else if (nameChanged) {
                    return this.usersApi.updateUser(userId, { ...targetUser, name }).pipe(
                        map(updatedUser => UsersActions.updateUserAndRoleSuccess({ user: updatedUser })),
                        catchError(error => of(UsersActions.updateUserAndRoleFailure({ error })))
                    );
                } else if (roleChanged) {
                    return this.accountService.updateUserRole(userId, role).pipe(
                        map(() => UsersActions.updateUserAndRoleSuccess({ user: { ...targetUser, role } })),
                        catchError(error => of(UsersActions.updateUserAndRoleFailure({ error })))
                    );
                }
                return of(UsersActions.updateUserAndRoleSuccess({ user: targetUser }));
            })
        )
    );

    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.deleteUser),
            withLatestFrom(this.store.select(selectAuthUser)),
            mergeMap(([{ id }, authUser]) => {
                if (!authUser || authUser.role !== 'admin') {
                    return of(UsersActions.deleteUserFailure({ error: 'Unauthorized' }));
                }
                return this.accountService.deleteAccount(id).pipe(
                    map(() => UsersActions.deleteUserSuccess({ id })),
                    catchError(error => of(UsersActions.deleteUserFailure({ error })))
                );
            })
        )
    );

    reloadUsersAfterDelete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UsersActions.deleteUserSuccess),
            withLatestFrom(
                this.store.select(selectUsersPage),
                this.store.select(selectUsersPageSize)
            ),
            map(([_, page, pageSize]) => UsersActions.loadUsers({ page, pageSize }))
        )
    );

}
