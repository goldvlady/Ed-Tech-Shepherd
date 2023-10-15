import GoogleIcon from '../assets/google.svg';
import { useCustomToast } from '../components/CustomComponents/CustomToast/useCustomToast';
import SecureInput from '../components/SecureInput';
import {
  firebaseAuth,
  signInWithEmailAndPassword,
  googleProvider
} from '../firebase';
import { useTitle } from '../hooks';
import userStore from '../state/userStore';
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
  useToast
} from '@chakra-ui/react';
import {
  signInWithPopup,
  fetchSignInMethodsForEmail,
  signOut,
  getAuth
} from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Field, Form, Formik } from 'formik';
import React, { useCallback, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';

const Root = styled(Box)``;

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('A valid email address is required'),
  password: Yup.string().required('A password is required')
});

const Login: React.FC = () => {
  useTitle('Login');
  const toast = useCustomToast();
  const navigate = useNavigate();
  const auth = getAuth();
  const { user: appUser, fetchUser } = userStore();

  const handleNavigation = useCallback(() => {
    console.log('APPP USER', appUser);
    let path = '/dashboard';

    if (appUser?.type.includes('tutor')) {
      path = '/dashboard/tutordashboard';
    }

    if (appUser?.signedUpAsTutor && !appUser?.tutor) {
      path = '/complete_profile';
    }
    console.log('PATH', path);

    navigate(path);
  }, [appUser, navigate]);
  // useEffect(() => {
  //   onAuthStateChanged(firebaseAuth, (user: any) => {
  //     if (user) {
  //       sessionStorage.setItem('UserDetails', JSON.stringify(user));
  //       const email = user.email;
  //       const photoURL = user.photoURL;
  //       const emailVerified = user.emailVerified;
  //       const uid = user.uid;
  //       sessionStorage.setItem('Username', user.displayName);

  //       // ...
  //     } else {
  //       // User is signed out
  //       // ...
  //     }
  //   });
  // }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      await fetchUser();
      const userEmail = result?.user?.email;
      if (!userEmail) {
        toast({
          title: 'Invalid User',
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }

      // Check if user exists
      const signInMethods = await fetchSignInMethodsForEmail(
        firebaseAuth,
        userEmail as string
      );

      // If there are no sign-in methods for this email, it means the user doesn't exist.
      if (signInMethods.length === 0) {
        toast({
          title: "User doesn't exist, not signing in.",
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
        return;
      }
      handleNavigation();
    } catch (error) {
      toast({
        title: 'Invalid User',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  }, [appUser, handleNavigation]);

  const loginWithoutEmail = useCallback(
    async (values, { setSubmitting }) => {
      try {
        const { user } = await signInWithEmailAndPassword(
          firebaseAuth,
          values.email,
          values.password
        );

        if (user && user.emailVerified) {
          sessionStorage.setItem('email', user.email as string);
          sessionStorage.setItem('UserDetails', JSON.stringify(user));
          await fetchUser();
          handleNavigation();
          // ...
        } else {
          signOut(auth).then(() => {
            localStorage.clear();
            navigate('/verification_pending');
          });
          // navigate('/dashboard');
        }
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
            errorMessage = 'An unexpected error occurred';
            break;
        }

        toast({
          title: errorMessage,
          position: 'top-right',
          status: 'error',
          isClosable: true
        });
      }
      setSubmitting(false);
    },
    [handleNavigation, appUser, navigate, fetchUser]
  );

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
          onSubmit={loginWithoutEmail}
        >
          {({ errors, isSubmitting, submitForm }) => (
            <Form>
              <Field name="email">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    isInvalid={form.errors.email && form.touched.email}
                  >
                    <FormLabel>Email</FormLabel>
                    <Input
                      fontSize="0.875rem"
                      fontFamily="Inter"
                      fontWeight="400"
                      size={'lg'}
                      isInvalid={form.errors.email && form.touched.email}
                      {...field}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="password">
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    marginTop={'22px'}
                    isInvalid={form.errors.password && form.touched.password}
                  >
                    <FormLabel>Password</FormLabel>
                    <SecureInput
                      fontSize="0.875rem"
                      fontFamily="Inter"
                      fontWeight="400"
                      size={'lg'}
                      isInvalid={form.errors.password && form.touched.password}
                      {...field}
                      placeholder="Enter password"
                      autoComplete="current-password"
                    />
                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
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
                  isDisabled={Object.values(errors).length !== 0}
                  isLoading={isSubmitting}
                  width={'100%'}
                  size="lg"
                  onClick={() => {
                    console.log('clicked');
                    submitForm();
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="solid"
                  bg="#F2F2F3"
                  onClick={() => loginWithGoogle()}
                  colorScheme={'primary'}
                  size={'lg'}
                  color="#000"
                  leftIcon={<img src={GoogleIcon} alt="" />}
                >
                  Continue With Google
                </Button>
                <Link
                  color="primary.400"
                  className="body2 text-center"
                  as={RouterLink}
                  to="/signup"
                >
                  <span className="body2">Don’t have an account?</span> Sign up
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
