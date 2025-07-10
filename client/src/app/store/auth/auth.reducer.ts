import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: any | null;
  loading: boolean;
  error: any | null;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, AuthActions.register, (state) => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, AuthActions.registerSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.whoami, (state) => ({ ...state, loading: true, error: null })),
  on(AuthActions.whoamiSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(AuthActions.whoamiFailure, (state, { error }) => ({
    ...state,
    user: null,
    loading: false,
  })),
  on(AuthActions.logout, () => initialState)
);
