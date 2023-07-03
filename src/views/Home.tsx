import { firebaseAuth } from '../firebase';
import { Box, Button } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';

function Home() {
  const navigate = useNavigate();

  const logOut = () => {
    signOut(firebaseAuth)
      .then(() => {
        // Sign-out successful.
        navigate('/login');
      })
      .catch((error) => {
        // Handle this error?
      });
  };
  return (
    <Box>
      Sheperd Home Page- Dashboard <Button onClick={logOut}> LOGOUT</Button>
    </Box>
  );
}

export default Home;
