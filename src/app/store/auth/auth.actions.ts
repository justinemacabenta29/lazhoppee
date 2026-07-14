import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user';


// Dispatched when login succeeds
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

// Dispatched when the user logs out
export const logout = createAction('[Auth] Logout');