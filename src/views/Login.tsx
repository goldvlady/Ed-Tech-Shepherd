import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Link,
    Text,
    useToast,
} from '@chakra-ui/react';
import { onAuthStateChanged } from 'firebase/auth';
import { Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';

import SecureInput from '../components/SecureInput';
import { firebaseAuth, signInWithEmailAndPassword } from '../firebase';
import { useTitle } from '../hooks';

const Root = styled(Box)``;

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Enter a valid email address')
        .required('A valid email address is required'),
    password: Yup.string().required('A password is required'),
});

const Login: React.FC = () => {
    useTitle('Login');
    const toast = useToast();
    const navigate = useNavigate();

    //   const user = firebaseAuth.currentUser;
    //   if (user !== null) {
    //     const displayName = user.displayName;
    //     const email = user.email;
    //     const photoURL = user.photoURL;
    //     const emailVerified = user.emailVerified;

    //     // The user's ID, unique to the Firebase project. Do NOT use
    //     // this value to authenticate with your backend server, if
    //     // you have one. Use User.getToken() instead.
    //     const uid = user.uid;
    //   }
    //   console.log(user);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user: any) => {
            if (user) {
                sessionStorage.setItem('UserDetails', JSON.stringify(user));
                const email = user.email;
                const photoURL = user.photoURL;
                const emailVerified = user.emailVerified;
                const uid = user.uid;
                sessionStorage.setItem('Username', user.displayName);

                // ...
            } else {
                // User is signed out
                // ...
            }
        });
    }, []);

    return (
        <Root>
            <Box mb={'20px'}>
                <Heading mb={'12px'} as={'h3'} textAlign={'center'}>
                    Welcome Back!
                </Heading>
                <Text m={0} className="body2" textAlign={'center'}>
                    Sign in to your Shepherd account
                </Text>
            </Box>
            <Box>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await signInWithEmailAndPassword(
                                firebaseAuth,
                                values.email,
                                values.password
                            );
                            navigate('/dashboard');
                        } catch (e: any) {
                            let errorMessage = '';
                            switch (e.code) {
                                case 'auth/user-not-found':
                                    errorMessage = 'Invalid email or password';
                                    break;
                                case 'auth/wrong-password':
                                    errorMessage = 'Invalid email or password';
                                    break;
                                default:
                                    errorMessage =
                                        'An unexpected error occurred';
                                    break;
                            }

                            toast({
                                title: errorMessage,
                                position: 'top-right',
                                status: 'error',
                                isClosable: true,
                            });
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ errors, isSubmitting }) => (
                        <Form>
                            <Field name="email">
                                {({
                                    field,
                                    form,
                                }: {
                                    field: any;
                                    form: any;
                                }) => (
                                    <FormControl
                                        isInvalid={
                                            form.errors.email &&
                                            form.touched.email
                                        }
                                    >
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            size={'lg'}
                                            isInvalid={
                                                form.errors.email &&
                                                form.touched.email
                                            }
                                            {...field}
                                            placeholder="Enter your email"
                                        />
                                        <FormErrorMessage>
                                            {form.errors.email}
                                        </FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="password">
                                {({
                                    field,
                                    form,
                                }: {
                                    field: any;
                                    form: any;
                                }) => (
                                    <FormControl
                                        marginTop={'22px'}
                                        isInvalid={
                                            form.errors.password &&
                                            form.touched.password
                                        }
                                    >
                                        <FormLabel>Password</FormLabel>
                                        <SecureInput
                                            size={'lg'}
                                            isInvalid={
                                                form.errors.password &&
                                                form.touched.password
                                            }
                                            {...field}
                                            placeholder="Enter password"
                                        />
                                        <FormErrorMessage>
                                            {form.errors.password}
                                        </FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Box>
                                <Link
                                    color="primary.400"
                                    className="body2"
                                    as={RouterLink}
                                    to="/forgot-password"
                                >
                                    Forgot password?
                                </Link>
                            </Box>
                            <Box
                                marginTop={'36px'}
                                display={'flex'}
                                flexDirection="column"
                                gap={4}
                                justifyContent="flex-end"
                            >
                                <Button
                                    isDisabled={
                                        Object.values(errors).length !== 0
                                    }
                                    isLoading={isSubmitting}
                                    width={'100%'}
                                    size="lg"
                                    type="submit"
                                >
                                    Login
                                </Button>
                                <Link
                                    color="primary.400"
                                    className="body2 text-center"
                                    as={RouterLink}
                                    to="/signup"
                                >
                                    <span className="body2">
                                        Don’t have an account?
                                    </span>{' '}
                                    Sign up
                                </Link>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Root>
    );
};

export default Login;
