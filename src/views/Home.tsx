import { Box, Button } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import ApiService from '../services.ts/ApiService';
import { firebaseAuth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';
function Home() {
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem("token")) {
            const userDetails = ApiService.getUser()
            console.log(userDetails);

        }
    }, [])
    const logOut = () => {
        signOut(firebaseAuth).then(() => {
            // Sign-out successful.
            console.log("signOutSUCCESSFUL");
            navigate("/login")

        }).catch((error) => {
            console.log(error);

        });
    }
    return (<Box>Sheperd Home Page- Dashboard  <Button onClick={logOut}> LOGOUT</Button></Box>);
}

export default Home;