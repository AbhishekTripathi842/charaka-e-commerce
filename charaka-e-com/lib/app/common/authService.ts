import router from 'next/router';
import { Tokens, User } from '../../storage/index';
import { LOGIN } from './routeConstants';

export const onLogout = () => {
    Tokens.removeLocalData();
    router.push(LOGIN);
    return true;
};

export const getToken = () => Tokens.getToken();
export const getUserDetails = () => User.getUserDetails();


export const isLoggedIn = () => {
    if (getToken() && getUserDetails()) {
        return true;
    } else {
        Tokens.removeLocalData();
        return false
    }
};