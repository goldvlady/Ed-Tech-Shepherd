import MessageIcon from '../../../assets/message.svg';
import OfferIcon from '../../../assets/offer.svg';
import ReadIcon from '../../../assets/read.svg';
import UnreadIcon from '../../../assets/unread.svg';
import VideoIcon from '../../../assets/video.svg';
import { database } from '../../../firebase';
import userStore from '../../../state/userStore';
import { TimeAgo } from './TimeAgo';
import useNotifications from './useNotification';
import {
  Badge,
  Box,
  Flex,
  Spacer,
  Text,
  Divider,
  Image,
  Stack
} from '@chakra-ui/react';
import { ref, onValue, DataSnapshot, off } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// import OfferIcon from 'svgs/text-document.svg';

function Notifications(props) {
  const { data, handleRead, handleAllRead } = props;
  const { user } = userStore();
  const currentPath = window.location.pathname;
  // const parsedNotifications = data.map((item) => item.notification);

  const isTutor = currentPath.includes('/dashboard/tutordashboard');

  const isWithinAWeek = (createdAt) => {
    const aWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return new Date(createdAt) >= new Date(aWeekAgo);
  };
  const filteredData = data
    .filter((item) => {
      if (isTutor) {
        const allowedTypes = [
          'new_offer_received',
          'upcoming_class',
          'BOUNTY_ACCEPTED',
          'BOUNTY_BID_ACCEPTED'
        ];
        return (
          allowedTypes.includes(item.type) && isWithinAWeek(item.createdAt)
        );
      } else {
        const allowedTypes = [
          'new_offer_created',
          'offer_accepted',
          'offer_rejected',
          'upcoming_class',
          'BOUNTY_BID_RECIEVED',
          'BOUNTY_CREATED'
        ];
        return (
          allowedTypes.includes(item.type) && isWithinAWeek(item.createdAt)
        );
      }
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  console.log('filteredData', data, filteredData);

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
  // const [notifications, setNotifications] = useState<string[]>([]);
  // const [hasUnreadNotification, setHasUnreadNotification] =
  //   useState<boolean>(false);
  // console.log(notifications, 'nino');

  // useEffect(() => {
  //   const notificationsRef = ref(database, `notifications`);

  //   const fetchNotifications = () => {
  //     onValue(notificationsRef, (snapshot: DataSnapshot) => {
  //       const data = snapshot.val();

  //       if (data) {
  //         const notificationsArray: string[] = Object.values(data);
  //         setNotifications(notificationsArray);
  //       } else {
  //         setNotifications([]);
  //       }
  //     });
  //   };

  //   // Call the fetchNotifications function when the component mounts
  //   fetchNotifications();

  //   // Clean up the Firebase listener when the component unmounts
  //   return () => {
  //     off(notificationsRef); // This removes the listener
  //   };
  // }, []);
  const userId = user?._id || '';
  const { notifications, hasUnreadNotification } = useNotifications(userId);

  const handleNotificationClick = (notificationId) => {
    // Mark the notification as read in the database
    // const notificationRef = ref(database, `notifications/${notificationId}`);
    // update(notificationRef, { read: true })
    //   .then(() => {
    console.log(`Notification ${notificationId} marked as read`);
    //   })
    //   .catch((error) => {
    //     console.error('Error marking notification as read:', error);
    //   });
  };

  return (
    <>
      <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
        <Flex>
          <Text
            fontSize={10}
            fontWeight={500}
            color="text.400"
            textTransform={'uppercase'}
          >
            notifications
            <Badge bgColor="#EBF4FE" color="#207df7" fontSize={10}>
              <Text>{filteredData ? filteredData.length : ''}</Text>
            </Badge>
          </Text>
          <Spacer />{' '}
          <Text
            fontSize={10}
            fontWeight={500}
            color="#207df7"
            onClick={handleAllRead}
            cursor="pointer"
          >
            Mark all as read{' '}
          </Text>
        </Flex>

        {data &&
          filteredData.map((i) => (
            <>
              <div
                className={`notification-item ${i.read ? 'read' : ''}`}
                key={i._id}
              >
                <Flex
                  alignItems="flex-start"
                  px={3}
                  direction={'row'}
                  my={1}
                  py={2}
                  key={i._id}
                  position="relative"
                  // onClick={() => markAsRead(i._id)}
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
                  <Image
                    src={i.status === 'unviewed' ? ReadIcon : UnreadIcon}
                    alt="read"
                    maxHeight={45}
                    zIndex={1}
                    position="absolute"
                    right={0}
                    top={5}
                  />
                </Flex>
              </div>

              <Divide />
            </>
          ))}
      </Box>
    </>
  );
}

export default Notifications;
