import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Link, Text, useToast } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink, useNavigate } from "react-router-dom"
import styled from 'styled-components';
import SecureInput from '../components/SecureInput';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import CriteriaCheck from '../components/CriteriaCheck';
import { MinPasswordLength } from '../util';
import { useTitle } from '../hooks';
import { createUserWithEmailAndPassword, firebaseAuth } from '../firebase';

const Root = styled(Box)`
`

const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Enter a valid email address').required('A valid email address is required'),
    password: Yup.string().required('A password is required').min(MinPasswordLength, `Your password must be a minimum of ${MinPasswordLength} characters`),
    passwordConfirmation: Yup.string()
        .test('passwords-match', 'Passwords must match', function (value) {
            return this.parent.password === value
        })
});

const Signup: React.FC = () => {
    useTitle('Signup');
    const toast = useToast();
    const navigate = useNavigate();
    return <Root>
        <Box mb={'20px'}>
            <Heading mb={'12px'} as={'h3'} textAlign={"center"}>Create your Shepherd Account</Heading>
            <Text m={0} className='body2' textAlign={"center"}>Hi there, before you proceed, let us know who is signing up</Text>
        </Box>
        <Box>
            <Formik
                initialValues={{ email: '', password: '', passwordConfirmation: '' }}
                validationSchema={SignupSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        await createUserWithEmailAndPassword(firebaseAuth, values.email, values.password);
                        navigate('/dashboard');
                    } catch (e: any) {
                        let errorMessage = '';
                        switch (e.code) {
                            case 'auth/email-already-exists':
                                errorMessage = "A user with this email address already exists";
                                break;
                            default:
                                errorMessage = "An unexpected error occurred";
                                break;
                        }

                        toast({
                            title: errorMessage,
                            position: 'top-right',
                            status: 'error',
                            isClosable: true,
                        })
                    }
                    setSubmitting(false);
                }}
            >
                {({
                    errors,
                    isSubmitting,
                    values
                }) => (
                    <Form>
                        <Field name='email'>
                            {({ field, form }: { field: any, form: any }) => (
                                <FormControl isInvalid={form.errors.email && form.touched.email}>
                                    <FormLabel>Email</FormLabel>
                                    <Input isInvalid={form.errors.email && form.touched.email} {...field} placeholder='Enter your email' />
                                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name='password'>
                            {({ field, form }: { field: any, form: any }) => (
                                <FormControl marginTop={'22px'} isInvalid={form.errors.password && form.touched.password}>
                                    <FormLabel>Password</FormLabel>
                                    <SecureInput isInvalid={form.errors.password && form.touched.password} {...field} placeholder='Enter password' />
                                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name='passwordConfirmation'>
                            {({ field, form }: { field: any, form: any }) => (
                                <FormControl marginTop={'22px'} isInvalid={form.errors.passwordConfirmation && form.touched.passwordConfirmation}>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <SecureInput isInvalid={form.errors.passwordConfirmation && form.touched.passwordConfirmation} {...field} placeholder='Re-enter password' />
                                    <FormErrorMessage>{form.errors.passwordConfirmation}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <CriteriaCheck mt={17.5} text={`${MinPasswordLength} character minimum`} checked={values.password.length >= MinPasswordLength} />
                        <Box marginTop={'36px'} display={"flex"} flexDirection="column" gap={4} justifyContent="flex-end">
                            <Button isDisabled={Object.values(errors).length !== 0} width={'100%'} size='lg' type='submit' isLoading={isSubmitting}>Sign Up</Button>
                            <Link color='primary.400' className='body2 text-center' as={RouterLink} to='/login'><span className='body2'>Already have an account?</span> Login</Link>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    </Root>
}

export default Signup;