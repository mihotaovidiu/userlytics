import { AuthEffects } from './auth/auth.effects';
import { authReducer } from './auth/auth.reducer';
import { UsersEffects } from './users/users.effects';
import { usersReducer } from './users/users.reducer';

export const reducers = {
    auth: authReducer,
    users: usersReducer,
};

export const effects = [AuthEffects, UsersEffects]