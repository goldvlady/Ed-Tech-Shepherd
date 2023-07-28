import {
  Layout,
  Breadcrumb,
  OfferSummary,
  AcceptOfferModal,
  DeclineOfferModal,
  DetailsCard
} from '../../../components';
import { Box, Container, Heading, Text, Grid } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import React, { Fragment, useState } from 'react';

export default function Offer() {
  const {
    isOpen: isOpenOfferModal,
    onOpen: onOpenOfferModal,
    onClose: onCloseOfferModal
  } = useDisclosure();

  const {
    isOpen: isOpenDeclineModal,
    onOpen: onOpenDeclineModal,
    onClose: onCloseDeclineModal
  } = useDisclosure();
  return (
    <>
      <Layout className="px-4 bg-white">
        <Breadcrumb />

        <Box my={4}>
          <Heading as="h4" fontSize="2xl" fontWeight="bold" mb={2}>
            Review Offer
          </Heading>
          <Text as="p" color="gray.600" fontSize="sm">
            Respond to offer from clients, you may also choose to renegotiate
          </Text>
        </Box>

        <Container maxW="7xl" px={[4, 2]} py={10} mx="auto">
          <Grid
            templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }}
            templateRows="1fr"
            alignItems="start"
            gap={8}
            mx={{ base: 'auto', lg: 0 }}
            maxW={{ base: '2xl', lg: 'none' }}
          >
            {/* Offer Summary */}
            <OfferSummary
              // onOpenOfferModal={onOpenOfferModal}
              // onOpenDeclineModal={onOpenDeclineModal}
              setOfferModalState={onOpenOfferModal}
              setDeclineOfferModalState={onOpenDeclineModal}
            />

            <DetailsCard
              name="Liam Kelly"
              avatarSrc="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              offerExpires="June 10, 2023"
              subjectLevel="Mathematics - A-Level"
              availability="Mon, Tue, Wed"
              note="Consequat luctus morbi suspendisse eu quis diam eleifend orci aliquet. Facilisi in lorem ultricies ligula arcu odio"
              hourlyRate="$25.00/hr"
              serviceFee="5% service fee (-$3.00/hr)"
              finalRate="$22.00/hr"
              totalAmount="$214.00"
              paymentAwareness="You'll be paid after each session"
              paymentNote="Initial payment will not be made until after the client reviews the offer after the first session. The client may decide to continue with you or withdraw the offer"
            />
          </Grid>
        </Container>
      </Layout>

      {/* Accept Offer Modal */}
      <AcceptOfferModal
        setOfferModalState={onOpenOfferModal}
        offerModalState={isOpenOfferModal}
        onClose={onCloseOfferModal}
      />

      {/* Decline Offer Modal */}
      {/* <DeclineOfferModal
        isOpen={isOpenDeclineModal}
        onClose={onCloseDeclineModal}
      /> */}
    </>
  );
}
