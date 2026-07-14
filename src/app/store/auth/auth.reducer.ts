import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { initialState } from './auth.state';

export const authReducer = createReducer(
  initialState,

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    user: null
  }))
);