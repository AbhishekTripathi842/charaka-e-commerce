import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    Stack,
    Image,
    FormErrorMessage,
    InputRightElement,
    InputGroup
} from '@chakra-ui/react';
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa';
import React, { ChangeEvent, useState } from 'react';
import { responseMessage, validateEmail } from '../lib/app/utils';
import { useMutation } from 'react-query';
import router from 'next/router';
import { Tokens, User } from '../lib/storage';
import { adminLoginApi } from '../lib/api/sdk';

interface ILoginState {
    email: string;
    emailError: string,
    password: string,
    passwordError: string,
    showPassword: boolean,
    rememberMe: boolean
}

interface ILoginResponseData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    token: string;
}

const Login = () => {
    const [state, setState] = useState<ILoginState>({
        email: "",
        emailError: "",
        password: "",
        passwordError: "",
        showPassword: false,
        rememberMe: false
    });
    const { email, emailError, password, passwordError, showPassword, rememberMe } = state;

    const validate = () => {
        let error = false;
        if (email.length === 0) {
            setState((prevState) => ({ ...prevState, emailError: responseMessage('email.required') }));
            error = true;
        } else if (!validateEmail(email)) {
            setState((prevState) => ({ ...prevState, emailError: responseMessage('email.required') }));
            error = true;
        }
        if (password.length === 0) {
            setState((prevState) => ({ ...prevState, passwordError: responseMessage('password.required') }));
            error = true;
        }
        return !error;
    }

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setState({ ...state, [name]: value });
    }

    const checkValidation = (event: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (value.length === 0) {
            setState(prevState => ({ ...prevState, [`${name}Error`]: responseMessage(`${name}.required`) }));
        } else if (name === "email" && !validateEmail(value)) {
            setState(prevState => ({ ...prevState, [`${name}Error`]: responseMessage(`${name}.invalid`) }))
        }
    }

    const resetErrorMessage = (event: React.FocusEvent<HTMLInputElement>) => {
        const { name } = event.target;
        setState(prevState => ({ ...prevState, [`${name}Error`]: "" }))
    }

    const mutation = useMutation(adminLoginApi, {
        onSuccess: (data): void | Promise<unknown> => {
            // Invalidate and refetch
            if (data.status) {
                const getLoginData: ILoginResponseData = data.data;
                Tokens.setToken(data.data.token);
                let userData = {
                    email: getLoginData && getLoginData.email ? getLoginData.email : '',
                    id: getLoginData && getLoginData.id ? getLoginData.id : '',
                    firstName: getLoginData && getLoginData.firstName ? getLoginData.firstName : '',
                    lastName: getLoginData && getLoginData.lastName ? getLoginData.lastName : '',
                }
                User.setUserDetails(userData);
                router.push('/')
            }
        }
    })

    const toggleRememberMe = () => {
        setState({ ...state, rememberMe: !state.rememberMe })
    }

    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const body: { email: string; password: string; } = { email, password };
        if (validate()) {
            if (email !== "" && password !== "") {
                mutation.mutate(body)
            }
        }
    }

    const isFormValid = () => {
        return [email, password].every(Boolean);
    };
    return (
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack spacing={4} w={'full'} maxW={'md'}>
                    <Heading fontSize={'2xl'}>Sign in to your account</Heading>
                    <FormControl id="email" isInvalid={!emailError ? false : true}>
                        <FormLabel>Email address</FormLabel>
                        <Input type="email" id='email' name='email' value={email} onChange={handleOnChange} onFocus={resetErrorMessage} onBlur={checkValidation} />
                        {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
                    </FormControl>
                    <FormControl id="password" isInvalid={!passwordError ? false : true}>
                        <FormLabel>Password</FormLabel>
                        <InputGroup size='md'>
                            <Input type={showPassword ? 'text' : 'password'} id='password' name='password' value={password} onChange={handleOnChange} onFocus={resetErrorMessage} onBlur={checkValidation} />
                            <InputRightElement width='2.5rem' cursor={'pointer'} onClick={() => { setState({ ...state, showPassword: !state.showPassword }) }}>
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </InputRightElement>
                        </InputGroup>
                        {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                    </FormControl>
                    <Stack spacing={6}>
                        <Stack
                            direction={{ base: 'column', sm: 'row' }}
                            align={'start'}
                            justify={'space-between'}>
                            <Checkbox name='rememberMe' checked={rememberMe} onChange={toggleRememberMe} >Remember me</Checkbox>
                            <Link color={'blue.500'}>Forgot password?</Link>
                        </Stack>
                        <Button colorScheme={'blue'} variant={'solid'} onClick={handleOnSubmit} disabled={!isFormValid()}>
                            Sign in
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
            <Flex flex={1}>
                <Image
                    alt={'Login Image'}
                    objectFit={'cover'}
                    src={
                        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
                    }
                />
            </Flex>
        </Stack>
    );
}

export default Login;