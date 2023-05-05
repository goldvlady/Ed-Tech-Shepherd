import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import {
    Flex,
    Box,
    ButtonGroup,
    VisuallyHidden,
    createIcon,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Container,
    Divider,
    Link,
    Button,
    Heading,
    Text,
    HStack,
    IconButton,
    InputGroup,
    InputProps,
    InputRightElement,
    useDisclosure,
    useMergeRefs,
    useColorModeValue,
} from '@chakra-ui/react';
import { firebaseAuth, googleProvider } from '../firebase';
import Logo from "../components/Logo";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect } from 'firebase/auth';

import { String } from 'lodash';


function Login() {
    const [email, setEmail] = useState<string>("ladapokintus@yahoo.com");
    const [password, setPassword] = useState<string>("pass1234$$");


    const [value, setValue] = useState<any>('')
    const handleClick = () => {
        signInWithPopup(firebaseAuth, googleProvider).then((data) => {
            setValue(data?.user.email)
            const mail: any = data?.user.email;
            localStorage.setItem("email", mail)
        })
    }

    useEffect(() => {
        setValue(localStorage.getItem('email'))
    })
    const signInWithGoogle = async () => {
        signInWithRedirect(firebaseAuth, googleProvider)
            .then((result: any) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential?.accessToken;
                // // The signed-in user info.
                // const user = result?.users;
                console.log(result);

                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    };



    const logInWithEmailAndPassword = async () => {
        try {
            await signInWithEmailAndPassword(firebaseAuth, email, password);
        } catch (err: any) {
            console.error(err);
            alert(err.message);
        }
    };
    // useEffect(() => {
    //     signInWithGoogle();
    // }, [])

    const PasswordField = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
        const { isOpen, onToggle } = useDisclosure()
        const inputRef = useRef<HTMLInputElement>(null)

        const mergeRef = useMergeRefs(inputRef, ref)
        const onClickReveal = () => {
            onToggle()
            if (inputRef.current) {
                inputRef.current.focus({ preventScroll: true })
            }
        }

        return (
            <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                    <InputRightElement>
                        <IconButton
                            variant="link"
                            aria-label={isOpen ? 'Mask password' : 'Reveal password'}
                            icon={isOpen ? <HiEyeOff /> : <HiEye />}
                            onClick={onClickReveal}
                        />
                    </InputRightElement>
                    <Input
                        id="password"
                        ref={mergeRef}
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={isOpen ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        {...props}
                    />
                </InputGroup>
            </FormControl>
        )
    })

    const GoogleIcon = createIcon({
        displayName: 'GoogleIcon',
        path: (
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
            </g>
        ),
    })

    const providers = [
        { name: 'Google', icon: <GoogleIcon boxSize="5" /> },
    ]



    return (<Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
            <Stack spacing="6">
                <Box textAlign={"center"}><Logo /></Box>
                <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
                    {value ? <Box>SIGNED IN</Box> : <Heading size={{ base: 'xs', md: 'sm' }}>Log in to your account</Heading>}

                    <HStack spacing="1" justify="center">
                        <Text color="muted">Don't have an account?</Text>
                        <Button variant="link" colorScheme="blue">
                            Sign up
                        </Button>
                    </HStack>
                </Stack>
            </Stack>
            <Box
                py={{ base: '0', sm: '8' }}
                px={{ base: '4', sm: '10' }}
                bg={{ base: 'transparent', sm: 'bg-surface' }}
                boxShadow={{ base: 'none', sm: 'md' }}
                borderRadius={{ base: 'none', sm: 'xl' }}
            >
                <Stack spacing="6">
                    <Stack spacing="5">
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FormControl>
                        <PasswordField />
                    </Stack>
                    <HStack justify="space-between">
                        <Checkbox defaultChecked>Remember me</Checkbox>
                        <Button variant="link" colorScheme="blue" size="sm">
                            Forgot password?
                        </Button>
                    </HStack>
                    <Stack spacing="6">
                        <Button variant="primary" onClick={handleClick}>Sign in</Button>
                        <HStack>
                            <Divider />
                            <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                                or continue with
                            </Text>
                            <Divider />
                        </HStack>
                        <ButtonGroup variant="outline" spacing="4" width="full">
                            {providers.map(({ name, icon }) => (
                                <Button key={name} width="full" onClick={handleClick}>
                                    <VisuallyHidden>Sign in with {name}</VisuallyHidden>
                                    {icon}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </Stack>
                </Stack>
            </Box>
        </Stack>
    </Container>);
}

export default Login;