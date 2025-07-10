import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/shared-types';

export const loadUsers = createAction('[Users] Load Users', props<{ page: number; pageSize: number; search?: string }>());
export const loadUsersSuccess = createAction('[Users] Load Users Success', props<{ users: User[]; total: number; page: number; pageSize: number }>());
export const loadUsersFailure = createAction('[Users] Load Users Failure', props<{ error: any }>());

export const deleteUser = createAction('[Users] Delete User', props<{ id: number }>());
export const deleteUserSuccess = createAction('[Users] Delete User Success', props<{ id: number }>());
export const deleteUserFailure = createAction('[Users] Delete User Failure', props<{ error: any }>());

export const updateUserAndRole = createAction('[Users] Update User And Role', props<{ userId: number; name: string; role: 'admin' | 'user' }>());
export const updateUserAndRoleSuccess = createAction('[Users] Update User And Role Success', props<{ user: User }>());
export const updateUserAndRoleFailure = createAction('[Users] Update User And Role Failure', props<{ error: any }>());
