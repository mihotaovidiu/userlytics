import { createAction, props } from '@ngrx/store';

export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: any; access_token: string }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>());

export const register = createAction('[Auth] Register', props<{ name: string; email: string; password: string }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ user: any; access_token: string }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: any }>());

export const logout = createAction('[Auth] Logout');

export const whoami = createAction('[Auth] Whoami');
export const whoamiSuccess = createAction('[Auth] Whoami Success', props<{ user: any }>());
export const whoamiFailure = createAction('[Auth] Whoami Failure', props<{ error: any }>());
