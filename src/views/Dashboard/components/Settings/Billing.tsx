import theme from '../../../../theme';
import { PaymentMethod } from '../../../../types';
import {
  Box,
  Button,
  Image,
  Radio,
  Text,
  Spacer,
  Stack,
  Avatar,
  Flex,
  Divider,
  VStack
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { RiArrowRightSLine } from 'react-icons/ri';
import styled from 'styled-components';

function Billing(props) {
  const { username, email } = props;

  const CardBrand = styled.img`
    height: 30px;
    width: 30px;
  `;

  const CardMeta = styled(Box)`
    flex-grow: 1;
    p {
      margin: 0;
    }
  `;

  const CardRoot = styled(Box)`
    border: 1px solid ${theme.colors.gray[300]};
    border-radius: 10px;
    padding-inline: 16px;
    padding-block: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;

    &:hover {
      border-color: ${theme.colors.gray[400]};
    }
  `;

  const getBrandLogo = (brand: string) => {
    if (brand === 'mastercard') {
      return <CardBrand src="/images/mastercard.svg" />;
    }
    if (brand === 'amex') {
      return <CardBrand src="/images/amex.svg" />;
    }
    if (brand === 'discover') {
      return <CardBrand src="/images/discover.svg" />;
    }
    if (brand === 'diners') {
      return <CardBrand src="/images/diners.svg" />;
    }
    if (brand === 'jcb') {
      return <CardBrand src="/images/jcb.svg" />;
    }
    if (brand === 'unionpay') {
      return <CardBrand src="/images/unionpay.svg" />;
    }
    if (brand === 'visa') {
      return <CardBrand src="/images/visa.svg" />;
    }

    return <CardBrand src="/images/generic-card-brand.svg" />;
  };

  const paymentMethods = [
    {
      _id: '1',
      last4: '4455',
      expMonth: 'July',
      expYear: '2023',
      brand: 'visa'
    }
  ];

  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<any>(null);
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
          <Text fontSize={'12px'} color="text.400" textTransform={'uppercase'}>
            Manage Billing Methods
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
            Add new
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
                Primary
              </Text>{' '}
              <Text fontSize={12} color="text.300">
                Your primary billing methods is used for all recurring payments
              </Text>
            </Stack>
          </Flex>
          <Divider />
          <Flex width={'100%'} alignItems="center">
            <Stack spacing={'2px'}>
              {/* <Text
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
              </Text>{' '} */}
              {/* <Text fontSize={12} color="text.300">
                0215824341
              </Text> */}

              {paymentMethods.map((pm) => (
                <Flex
                  onClick={() => setCurrentPaymentMethod(pm)}
                  key={pm._id}
                  gap={2}
                  alignItems="center"
                >
                  {getBrandLogo(pm.brand)}

                  <Text fontSize={14} color="text.300" fontWeight={500}>
                    Ending in •••• {pm.last4}
                  </Text>

                  {/* <Radio isChecked={currentPaymentMethod?._id === pm._id} /> */}
                </Flex>
              ))}
            </Stack>
            <Spacer />
            <Text fontSize={12} color="text.300">
              {' '}
              remove
            </Text>
          </Flex>

          <Flex width={'100%'} alignItems="center">
            <Stack spacing={'2px'}>
              {/* <Text
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
              </Text>{' '} */}
              <Text fontSize={12} color="text.300">
                You need a primary billing method when you have an active
                contract due. To remove this, set a new primary billing method
                first
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
