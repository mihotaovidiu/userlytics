import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';
import { User } from '../../shared/shared-types';

export interface UsersState {
    users: User[];
    loading: boolean;
    error: any;
    page: number;
    pageSize: number;
    total: number;
}

export const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
    page: 1,
    pageSize: 10,
    total: 0
};

export const usersReducer = createReducer(
    initialState,
    on(UsersActions.loadUsers, (state, { page, pageSize }) => ({ ...state, loading: true, error: null, page, pageSize })),
    on(UsersActions.loadUsersSuccess, (state, { users, total, page, pageSize }) => ({ ...state, users, total, page, pageSize, loading: false })),
    on(UsersActions.loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),
    on(UsersActions.updateUserAndRole, (state) => ({ ...state, loading: true, error: null })),
    on(UsersActions.updateUserAndRoleSuccess, (state, { user }) => ({
        ...state,
        users: state.users.map(u => u.id === user.id ? user : u),
        loading: false
    })),
    on(UsersActions.updateUserAndRoleFailure, (state, { error }) => ({ ...state, loading: false, error })),
    on(UsersActions.deleteUser, (state) => ({ ...state, loading: true, error: null })),
    on(UsersActions.deleteUserSuccess, (state, { id }) => ({
        ...state,
        users: state.users.filter(u => u.id !== id),
        loading: false
    })),
    on(UsersActions.deleteUserFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
