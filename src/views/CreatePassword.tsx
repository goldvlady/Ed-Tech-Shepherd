import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Link,
    Text,
    useToast,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import {
    Link as RouterLink,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';

import CriteriaCheck from '../components/CriteriaCheck';
import SecureInput from '../components/SecureInput';
import { confirmPasswordReset, firebaseAuth } from '../firebase';
import { useTitle } from '../hooks';
import { MinPasswordLength } from '../util';

const Root = styled(Box)``;

const ForgotPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .required('A password is required')
        .min(
            MinPasswordLength,
            `Your password must be a minimum of ${MinPasswordLength} characters`
        ),
    passwordConfirmation: Yup.string().test(
        'passwords-match',
        'Passwords must match',
        function (value) {
            return this.parent.password === value;
        }
    ),
});

const CreatePassword: React.FC = () => {
    useTitle('Create new password');
    const toast = useToast();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const oobCode = params.get('oobCode') ?? '';

    return (
        <Root>
            <Box mb={'20px'}>
                <Heading mb={'12px'} as={'h3'} textAlign={'center'}>
                    Create New Password
                </Heading>
                <Text m={0} className="body2" textAlign={'center'}>
                    Create a strong and secure password for signing in to your
                    account
                </Text>
            </Box>
            <Box>
                <Formik
                    initialValues={{ password: '', passwordConfirmation: '' }}
                    validationSchema={ForgotPasswordSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await confirmPasswordReset(
                                firebaseAuth,
                                oobCode,
                                values.password
                            );
                            toast({
                                title: 'Password reset successful',
                                position: 'top-right',
                                status: 'success',
                                isClosable: true,
                            });
                            navigate('/login');
                        } catch (e: any) {
                            let errorMessage = '';

                            switch (e.code) {
                                case 'auth/invalid-action-code':
                                    errorMessage =
                                        'Your password reset link is invalid or expired';
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
                    {({ errors, isSubmitting, values }) => (
                        <Form>
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
                            <Field name="passwordConfirmation">
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
                                            form.errors.passwordConfirmation &&
                                            form.touched.passwordConfirmation
                                        }
                                    >
                                        <FormLabel>Confirm Password</FormLabel>
                                        <SecureInput
                                            size={'lg'}
                                            isInvalid={
                                                form.errors
                                                    .passwordConfirmation &&
                                                form.touched
                                                    .passwordConfirmation
                                            }
                                            {...field}
                                            placeholder="Re-enter password"
                                        />
                                        <FormErrorMessage>
                                            {form.errors.passwordConfirmation}
                                        </FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <CriteriaCheck
                                mt={17.5}
                                text={`${MinPasswordLength} character minimum`}
                                checked={
                                    values.password.length >= MinPasswordLength
                                }
                            />
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
                                    width={'100%'}
                                    size="lg"
                                    type="submit"
                                    isLoading={isSubmitting}
                                >
                                    Confirm
                                </Button>
                                <Link
                                    color="primary.400"
                                    className="body2 text-center"
                                    as={RouterLink}
                                    to="/login"
                                >
                                    <span className="body2">
                                        Remember your old password?
                                    </span>{' '}
                                    Sign in now
                                </Link>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Root>
    );
};

export default CreatePassword;
