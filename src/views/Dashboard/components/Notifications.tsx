import MessageIcon from '../../../assets/message.svg';
import OfferIcon from '../../../assets/offer.svg';
import VideoIcon from '../../../assets/video.svg';
import { TimeAgo } from './TimeAgo';
import {
  Box,
  Flex,
  Spacer,
  Text,
  Divider,
  Image,
  Stack
} from '@chakra-ui/react';
import React from 'react';
import styled from 'styled-components';

// import OfferIcon from 'svgs/text-document.svg';

function Notifications(props) {
  const { data } = props;
  const currentPath = window.location.pathname;

  const isTutor = currentPath.includes('/dashboard/tutordashboard');

  const isWithinAWeek = (createdAt) => {
    const aWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return new Date(createdAt) >= new Date(aWeekAgo);
  };
  const filteredData = data.filter((item) => {
    if (isTutor) {
      return (
        (item.type === 'new_offer_received' ||
          item.type === 'upcoming_class') &&
        isWithinAWeek(item.createdAt)
      );
    } else {
      return (
        item.type !== 'new_offer_received' && isWithinAWeek(item.createdAt)
      );
    }
  });

  const Divide = styled(Divider)`
    &:last-child {
      display: none;
    }
  `;
  const getIconByANotificationType = (NotificationType) => {
    switch (NotificationType) {
      case 'note_created':
        return MessageIcon;
      case 'new_offer_created':
        return OfferIcon;
      case 'new_offer_received':
        return OfferIcon;
      case 'offer_accepted':
        return OfferIcon;
      case 'offer_rejected':
        return OfferIcon;
      case 'upcoming_class':
        return VideoIcon;
      case 'BOUNTY_CREATED':
        return OfferIcon;
      case 'BOUNTY_ACCEPTED':
        return OfferIcon;
      case 'BOUNTY_BID_ACCEPTED':
        return OfferIcon;
      case 'BOUNTY_BID_RECIEVED':
        return OfferIcon;
      case 'BOUNTY_BID_REJECTED':
        return OfferIcon;
      default:
        return undefined;
    }
  };
  const getTextByNotificationType = (NotificationType) => {
    switch (NotificationType) {
      case 'note_created':
        return 'New note created';
      case 'new_offer_created':
        return 'Your offer has been sent ';
      case 'new_offer_received':
        return 'You have received an offer  ';
      case 'offer_accepted':
        return 'Your Offer has been accepted';
      case 'offer_rejected':
        return 'Your Offer has been rejected';
      case 'upcoming_class':
        return 'Your chemistry lesson session with Leslie Peters started';
      case 'BOUNTY_CREATED':
        return 'Your Bounty has been placed';
      case 'BOUNTY_ACCEPTED':
        return 'Bounty Offer accepted';
      case 'BOUNTY_BID_ACCEPTED':
        return 'Bounty bid accepted';
      case 'BOUNTY_BID_RECIEVED':
        return 'Bounty bid received';
      case 'BOUNTY_BID_REJECTED':
        return 'Bounty bid rejected';

      default:
        return undefined;
    }
  };

  return (
    <>
      <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
        {data &&
          filteredData.map((i) => (
            <>
              <Flex
                alignItems="flex-start"
                px={3}
                direction={'row'}
                my={1}
                py={2}
                key={i._id}
              >
                <Image
                  src={getIconByANotificationType(i.type)}
                  alt="doc"
                  maxHeight={45}
                  zIndex={1}
                />
                <Stack direction={'column'} px={4} spacing={1}>
                  <Text color="text.300" fontSize={12} mb={0}>
                    {<TimeAgo timestamp={i.createdAt} />}
                  </Text>
                  <Text
                    fontWeight={400}
                    color="text.200"
                    fontSize="14px"
                    mb={0}
                  >
                    {getTextByNotificationType(i.type)}
                  </Text>

                  <Spacer />
                </Stack>
              </Flex>
              <Divide />
            </>
          ))}
      </Box>
    </>
  );
}

export default Notifications;
