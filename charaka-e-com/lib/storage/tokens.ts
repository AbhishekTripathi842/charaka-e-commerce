export function getToken() {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('ACCESS_TOKEN');
        return token;
    }

}

export function setToken(token: string) {
    if (typeof window !== 'undefined' && typeof token !== "undefined") {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.setItem('ACCESS_TOKEN', token);
        return token;
    }
}

export function removeLocalData() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('typeData');
        return true;
    }
}