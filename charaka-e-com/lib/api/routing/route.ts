const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const URL = (uri: string) => `${BASE_URL}${uri}`;
/***** Auth Api Routes *******/
export const ADMIN_LOGIN = URL('/auth/login');
