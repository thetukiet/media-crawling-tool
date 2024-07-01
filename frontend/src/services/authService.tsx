import api from './api';
import {ApiEndpoints} from "../constants/apiConstants";
import {User} from "../modals/User";

export const login = async (username: string, password: string): Promise<{token: string | null, user: User | null}> => {
    try {
        const response = await api.post(ApiEndpoints.AUTH_LOGIN, { username, password });
        const { token, user } = response.data;
        return {token, user};
    } catch (error) {
        console.error('Login failed', error);
        return {token: null, user: null};
    }
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};