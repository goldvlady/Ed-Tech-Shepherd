import {
  Box,
  Button,
  Text,
  Spacer,
  Stack,
  Avatar,
  Flex,
  Divider
} from '@chakra-ui/react';
import React from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';

function Billing(props) {
  const { username, email } = props;
  return (
    <Box>
      <Flex
        gap={3}
        p={4}
        alignItems="center"
        border="1px solid #EEEFF1"
        borderRadius="10px"
        mt={2}
        mb={4}
      >
        <Avatar boxSize="64px" color="white" name={username} bg="#4CAF50;" />
        <Stack spacing={'2px'}>
          <Text
            fontSize="16px"
            fontWeight={500}
            color="text.200"
            display={{ base: 'block', sm: 'none', md: 'block' }}
          >
            {username}
          </Text>{' '}
          <Text fontSize={14} color="text.400">
            {email}
          </Text>
        </Stack>
      </Flex>
      <Box
        px={4}
        alignItems="center"
        border="1px solid #EEEFF1"
        borderRadius="10px"
        my={4}
      >
        <Flex alignItems="center" my={2}>
          <Text fontSize={'12px'} color="text.400">
            PAYMENT
          </Text>
          <Spacer />
          <Button
            variant="unstyled"
            sx={{
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              px: 4,
              border: '1px solid #E7E8E9',
              color: '#5C5F64',
              height: '29px'
            }}
          >
            Change
          </Button>
        </Flex>

        <Divider />
        <Flex gap={5} direction="column" py={2} mb={8}>
          <Flex width={'100%'} alignItems="center">
            <Stack spacing={'2px'}>
              <Text
                fontSize="14px"
                fontWeight={500}
                color="text.200"
                display={{
                  base: 'block',
                  sm: 'none',
                  md: 'block'
                }}
              >
                Account Name
              </Text>{' '}
              <Text fontSize={12} color="text.300">
                Lateef Kayode{' '}
              </Text>
            </Stack>
          </Flex>
          <Flex width={'100%'} alignItems="center">
            <Stack spacing={'2px'}>
              <Text
                fontSize="14px"
                fontWeight={500}
                color="text.200"
                display={{
                  base: 'block',
                  sm: 'none',
                  md: 'block'
                }}
              >
                Account number
              </Text>{' '}
              <Text fontSize={12} color="text.300">
                0215824341
              </Text>
            </Stack>
          </Flex>
          <Flex width={'100%'} alignItems="center">
            <Stack spacing={'2px'}>
              <Text
                fontSize="14px"
                fontWeight={500}
                color="text.200"
                display={{
                  base: 'block',
                  sm: 'none',
                  md: 'block'
                }}
              >
                Bank name
              </Text>{' '}
              <Text fontSize={12} color="text.300">
                Bank of America
              </Text>
            </Stack>
          </Flex>
        </Flex>
      </Box>

      <Box
        p={4}
        alignItems="center"
        border="1px solid #EEEFF1"
        borderRadius="10px"
      >
        <Text fontSize={'12px'} color="text.400" mb={2}>
          SUPPORT
        </Text>

        <Divider />
        <Flex gap={4} direction="column" py={2}>
          <Flex width={'100%'} alignItems="center">
            <Stack spacing={'2px'}>
              <Text
                fontSize="14px"
                fontWeight={500}
                color="text.200"
                display={{
                  base: 'block',
                  sm: 'none',
                  md: 'block'
                }}
              >
                Terms and conditions
              </Text>{' '}
              <Text fontSize={12} color="text.300">
                Read Sherperd’s terms & conditions
              </Text>
            </Stack>
            <Spacer /> <RiArrowRightSLine size="24px" color="#969CA6" />
          </Flex>
          <Flex width={'100%'} alignItems="center">
            <Stack spacing={'2px'}>
              <Text
                fontSize="14px"
                fontWeight={500}
                color="text.200"
                display={{
                  base: 'block',
                  sm: 'none',
                  md: 'block'
                }}
              >
                Contact support
              </Text>{' '}
              <Text fontSize={12} color="text.300">
                Need help? Kindly reach out to our support team via mail
              </Text>
            </Stack>
            <Spacer /> <RiArrowRightSLine size="24px" color="#969CA6" />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}

export default Billing;
