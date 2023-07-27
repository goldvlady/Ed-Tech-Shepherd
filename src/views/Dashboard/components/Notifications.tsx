import MessageIcon from '../../../assets/message.svg';
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

function Notifications(props) {
  const { data } = props;
  const Divide = styled(Divider)`
    &:last-child {
      display: none;
    }
  `;
  return (
    <>
      <Box sx={{ maxHeight: '650px', overflowY: 'auto' }}>
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
                    key={i._id}
                  >
                    <Image
                      src={MessageIcon}
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
                        {i.text}
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
