export function setUserDetails(data: any) {
    localStorage.setItem('typeData', btoa(JSON.stringify(data)));
}

export const getUserDetails = () => {
    const typeData: any = localStorage.getItem('typeData');
    if (typeData === null) {
        return '';
    }
    try {
        const userData: any = JSON.parse(atob(typeData));
        return userData;
    } catch (e) {
        return
    }
}