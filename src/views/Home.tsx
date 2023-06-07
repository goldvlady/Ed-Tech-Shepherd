import { Box, Button } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';

import { firebaseAuth } from '../firebase';

function Home() {
    const navigate = useNavigate();

    const logOut = () => {
        signOut(firebaseAuth)
            .then(() => {
                // Sign-out successful.
                console.log('signOutSUCCESSFUL');
                navigate('/login');
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return (
        <Box>
            Sheperd Home Page- Dashboard{' '}
            <Button onClick={logOut}> LOGOUT</Button>
        </Box>
    );
}

export default Home;
