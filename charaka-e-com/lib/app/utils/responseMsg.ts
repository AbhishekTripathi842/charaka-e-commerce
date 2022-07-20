const errors = {
    'email.required': 'Email is required.',
    'email.invalid': 'Email is invalid.',
    'password.required': 'Password is required.'
};

export const responseMessage = (value: string) => {
    if (errors.hasOwnProperty(value)) {
        // tslint:disable-next-line:no-any
        return (errors as any)[value];
    }
    return value;
};