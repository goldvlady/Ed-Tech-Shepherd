import Logo from '../components/Logo';
import { firebaseAuth } from '../firebase';
import { Box, Button, Center, Flex, Text } from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';

function SwitchProfile() {
  const navigate = useNavigate();

  const logOut = () => {
    signOut(firebaseAuth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        // Handle this error?
      });
  };
  return (
    <>
      <Logo />
      <Center>
        <Box boxSize="full" border="1px solid #eaeaeb" m={45}>
          <Text>Select Account</Text>
        </Box>
      </Center>
    </>
  );
}

export default SwitchProfile;
