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
      case 'upcoming_class':
        return VideoIcon;
      default:
        return undefined;
    }
  };
  const getTextByNotificationType = (NotificationType) => {
    switch (NotificationType) {
      case 'note_created':
        return 'You have created a new note';
      case 'new_offer_created':
        return 'Your offer has been sent ';
      case 'new_offer_received':
        return 'You have received an offer  ';
      case 'upcoming_class':
        return 'Your chemistry lesson session with Leslie Peters started';
      default:
        return undefined;
    }
  };

  return (
    <>
      <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
        {data &&
          data.map((i) => {
            if (i.type !== 'new_offer_received') {
              return (
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
              );
            }
          })}
      </Box>
    </>
  );
}

export default Notifications;
