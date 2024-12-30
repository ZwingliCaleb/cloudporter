// Desc: Auth service to handle user authentication
import UserPool from '../services/UserPool';

const Auth = {
    logout: () => {
        const user = UserPool.getCurrentUser();
        if (user) {
            user.signOut();
        }
    },
    isAuthenticated: () => {
        const user = UserPool.getCurrentUser();
        return user !== null;
    },
};

export default Auth;