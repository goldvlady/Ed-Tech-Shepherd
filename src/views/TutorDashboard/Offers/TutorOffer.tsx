import {
  Layout,
  Breadcrumb,
  OfferSummary,
  AcceptOfferModal,
  DeclineOfferModal,
  DetailsCard
} from '../../../components';
import ApiService from '../../../services/ApiService';
import { Box, Container, Heading, Text, Grid } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import moment from 'moment';
import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router';

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
  const { id } = useParams();

  const [offer, setOffer] = useState<any>([]);
  const doFetchTutorOffer = useCallback(async (id) => {
    const response = await ApiService.getOffer(id);
    const resp = await response.json();
    setOffer(resp);
    /* eslint-disable */
  }, []);

  useEffect(() => {
    doFetchTutorOffer(id);
  }, [doFetchTutorOffer]);
  console.log('lork', offer);

  return (
    <>
      <Box className="px-4 bg-white">
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
              name={`${offer.student?.user?.name?.first} ${offer.student?.user?.name?.last}`}
              avatarSrc={offer.student?.user?.avatar}
              offerExpires={moment(offer.expirationDate).format(
                'MMMM DD, YYYY'
              )}
              subjectLevel={`${offer.course?.label} - ${offer.level?.label}`}
              availability="Mon, Tue, Wed"
              note={offer.note}
              hourlyRate="$25.00/hr"
              serviceFee="5% service fee (-$3.00/hr)"
              finalRate="$22.00/hr"
              totalAmount="$214.00"
              paymentAwareness="You'll be paid after each session"
              paymentNote="Initial payment will not be made until after the client reviews the offer after the first session. The client may decide to continue with you or withdraw the offer"
            />
          </Grid>
        </Container>
      </Box>

      {/* Accept Offer Modal */}
      <AcceptOfferModal
        setOfferModalState={onOpenOfferModal}
        offerModalState={isOpenOfferModal}
        onClose={onCloseOfferModal}
      />

      {/* Decline Offer Modal */}
      <DeclineOfferModal
        isOpen={onOpenDeclineModal}
        declineOfferModalState={isOpenDeclineModal}
        onClose={onCloseDeclineModal}
      />
    </>
  );
}
