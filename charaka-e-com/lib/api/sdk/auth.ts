import axios from 'axios';
import { ADMIN_LOGIN } from '../routing/route';

export const adminLoginApi = async (loginData: any) => {
    try {
        const { data: response } = await axios.post(ADMIN_LOGIN, loginData);
        return response;
    } catch (err: any) {
        if (err && err.response && err.response.data) {
            return err.response.data;
        }
    }
}