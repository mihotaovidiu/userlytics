import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { UsersState } from './users.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(selectUsersState, (state) => state.users);
export const selectUsersLoading = createSelector(selectUsersState, (state) => state.loading);
export const selectUsersError = createSelector(selectUsersState, (state) => state.error);
export const selectUsersPage = createSelector(selectUsersState, (state) => state.page);
export const selectUsersPageSize = createSelector(selectUsersState, (state) => state.pageSize);
export const selectUsersTotal = createSelector(selectUsersState, (state) => state.total);
