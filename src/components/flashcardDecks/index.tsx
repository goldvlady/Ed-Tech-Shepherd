import FlashCardDeck from './deck';
import FlashCardModal from './modal';
import { Box, Flex, Image, Text } from '@chakra-ui/react';

export { FlashCardModal, FlashCardDeck };

export const ConvertedComponent = () => {
  return (
    <Box
      fontFamily="Inter"
      fontSize="16px"
      backgroundColor="#fff"
      overflow="hidden"
      position="absolute"
      top="80px"
      left="calc(50% - 370px)"
      borderRadius="12px"
      width="740px"
      height="636px"
      color="#212224"
    >
      <Flex
        position="absolute"
        top="20px"
        left="30px"
        justifyContent="flex-start"
        gap="309px"
      >
        <Flex
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap="var(--gap-3xs)"
        >
          <Text color="#fb8441" fontWeight="500">
            Study Session
          </Text>
          <Flex
            borderRadius="4px"
            backgroundColor="#f4f5f6"
            display="flex"
            flexDirection="row"
            padding="4px 8px 5px"
            alignItems="flex-start"
            justifyContent="flex-start"
            fontSize="12px"
            color="#6e7682"
          >
            <Text>Medflashdeck</Text>
          </Flex>
        </Flex>
        <Flex display="flex" flexDirection="row" alignItems="center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.834 8.33301H16.6673L9.16732 19.1663V11.6663H3.33398L10.834 0.833008V8.33301Z"
              fill="white"
            />
          </svg>
          <Text letterSpacing="-0.05px" lineHeight="20px">
            Start
          </Text>
        </Flex>
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.58333 9.16699C3.575 9.16699 2.75 9.99199 2.75 11.0003C2.75 12.0087 3.575 12.8337 4.58333 12.8337C5.59167 12.8337 6.41667 12.0087 6.41667 11.0003C6.41667 9.99199 5.59167 9.16699 4.58333 9.16699ZM17.4167 9.16699C16.4083 9.16699 15.5833 9.99199 15.5833 11.0003C15.5833 12.0087 16.4083 12.8337 17.4167 12.8337C18.425 12.8337 19.25 12.0087 19.25 11.0003C19.25 9.99199 18.425 9.16699 17.4167 9.16699ZM11 9.16699C9.99167 9.16699 9.16667 9.99199 9.16667 11.0003C9.16667 12.0087 9.99167 12.8337 11 12.8337C12.0083 12.8337 12.8333 12.0087 12.8333 11.0003C12.8333 9.99199 12.0083 9.16699 11 9.16699Z"
            fill="#6E7682"
          />
        </svg>
      </Flex>
      <svg
        width="740"
        height="2"
        viewBox="0 0 740 2"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line y1="1" x2="740" y2="1" stroke="#EEEFF2" stroke-width="2" />
        <line y1="1" x2="200" y2="1" stroke="#207DF7" stroke-width="2" />
      </svg>
      <Flex
        position="absolute"
        left="calc(50% - 170px)"
        width="340px"
        top="110px"
        height="374px"
        fontSize="14px"
        color="#6e7682"
      >
        <Box
          position="absolute"
          top="30px"
          left="calc(50% - 128px)"
          borderRadius="8px"
          backgroundColor="#fff"
          boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
          width="256px"
          height="344px"
          overflow="hidden"
        />
        <Box
          position="absolute"
          top="20px"
          left="calc(50% - 142px)"
          borderRadius="8px"
          backgroundColor="#fff"
          boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
          width="284px"
          height="344px"
        />
        <Box
          position="absolute"
          top="10px"
          left="calc(50% - 156px)"
          borderRadius="8px"
          backgroundColor="#fff"
          boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
          width="312px"
          height="344px"
        />
        <Box
          position="absolute"
          left="calc(50% - 170px)"
          width="340px"
          top="0"
          borderRadius="8px"
          backgroundColor="#fff"
          boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
          height="344px"
          overflow="hidden"
        >
          <Flex
            position="absolute"
            top="225px"
            left="12px"
            display="none"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            gap="var(--gap-9xs)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.83342 11.8495L14.1956 6.4873L15.0206 7.31226L8.83342 13.4994L5.12109 9.78715L5.94605 8.9622L8.83342 11.8495Z"
                fill="white"
              />
            </svg>
            <Text color="#6e7682">Tap to reveal answer</Text>
          </Flex>
          <Text
            position="absolute"
            top="14px"
            left="calc(50% - 154px)"
            fontSize="14px"
            lineHeight="22px"
            fontWeight="500"
            color="#6e7682"
            display="inline-block"
            width="308px"
          >
            Quam in integer sed in tristique maecenas. Gravida turpis integer
            massa odio duis. adu dem posuere tellus sit lectus lacus ac sem.
            Temis
          </Text>
          <Box
            position="relative"
            borderRadius="8px"
            backgroundColor="#f4f5f6"
            flexDirection="column"
            padding="10px 12px 10px 14px"
            alignItems="flex-start"
          >
            <Box
              position="absolute"
              top="14px"
              left="14px"
              width="312px"
              height="40px"
            >
              <Text position="absolute" top="0" left="0" lineHeight="17px">
                Week 1
              </Text>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="10" fill="#207DF7" />
                <path
                  d="M8.83342 11.8495L14.1956 6.4873L15.0206 7.31226L8.83342 13.4994L5.12109 9.78715L5.94605 8.9622L8.83342 11.8495Z"
                  fill="white"
                />
              </svg>
              <Text position="absolute" top="0" left="78px" lineHeight="17px">
                1 month
              </Text>
              <Text position="absolute" top="0" left="162px" lineHeight="17px">
                3 months
              </Text>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="9"
                  stroke="#E6E8EA"
                  stroke-width="2"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="5"
                  stroke="#E6E8EA"
                  stroke-width="2"
                />
              </svg>
              <Text position="absolute" top="0" left="254px" lineHeight="17px">
                Long term
              </Text>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="9"
                  stroke="#E6E8EA"
                  stroke-width="2"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="5"
                  stroke="#E6E8EA"
                  stroke-width="2"
                />
              </svg>
              <Box
                position="absolute"
                top="28.85px"
                left="28.85px"
                borderTop="2.3px solid #f4f5f6"
                boxSizing="border-box"
                width="63.3px"
                height="2.3px"
              />
              <Box
                position="absolute"
                top="28.85px"
                left="109.85px"
                borderTop="2.3px solid #f4f5f6"
                boxSizing="border-box"
                width="36.3px"
              />
              <Box
                position="absolute"
                top="28.85px"
                left="109.85px"
                borderTop="2.3px solid #207df7"
                boxSizing="border-box"
                width="36.3px"
              />
              <Box
                position="absolute"
                top="28.85px"
                left="197.85px"
                borderTop="2.3px solid #f4f5f6"
                boxSizing="border-box"
                width="76.3px"
              />
              <Box
                position="absolute"
                top="20px"
                left="91px"
                borderRadius="50%"
                backgroundColor="#e6e8ea"
                width="20px"
                height="20px"
              />
            </Box>
          </Box>
          <Flex
            position="absolute"
            top="20px"
            left="calc(50% - 154px)"
            lineHeight="22px"
            fontWeight="500"
            color="#969ca6"
            display="inline-block"
            width="308px"
          >
            What are some key considerations when creating a user journey map?
          </Flex>
        </Box>
      </Flex>
      <Flex
        position="absolute"
        top="556px"
        left="calc(50% - 340px)"
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="flex-start"
        gap="14px"
        color="#4caf50"
      >
        <Box
          position="relative"
          borderRadius="8px"
          backgroundColor="#edf7ee"
          boxShadow="0 2px 6px rgba(136, 139, 143, 0.1)"
          width="217px"
          height="54px"
        >
          <Flex
            position="absolute"
            top="16.5px"
            left="calc(50% - 54.5px)"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="8px"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.66898 11.4661L10.8457 12.6428L17.9002 5.5881L19.0788 6.76661L10.8457 14.9998L5.54232 9.69643L6.72083 8.51793L8.49148 10.2886L9.66898 11.4661ZM9.6704 9.10968L13.7976 4.98242L14.9728 6.15766L10.8457 10.2848L9.6704 9.10968ZM7.3148 13.8223L6.13728 14.9998L0.833984 9.69643L2.01249 8.51793L3.19001 9.69551L3.18902 9.69643L7.3148 13.8223Z"
                fill="#4CAF50"
              />
            </svg>
            <Text fontWeight="500">Got it right</Text>
          </Flex>
        </Box>
        <Box
          position="relative"
          borderRadius="8px"
          backgroundColor="#ffefe6"
          width="218px"
          height="54px"
          color="#fb8441"
        >
          <Flex
            position="absolute"
            top="16.5px"
            left="calc(50% - 78px)"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="8px"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.99935 18.3337C5.39697 18.3337 1.66602 14.6027 1.66602 10.0003C1.66602 5.39795 5.39697 1.66699 9.99935 1.66699C14.6017 1.66699 18.3327 5.39795 18.3327 10.0003C18.3327 14.6027 14.6017 18.3337 9.99935 18.3337ZM9.99935 16.667C13.6813 16.667 16.666 13.6822 16.666 10.0003C16.666 6.31843 13.6813 3.33366 9.99935 3.33366C6.31745 3.33366 3.33268 6.31843 3.33268 10.0003C3.33268 13.6822 6.31745 16.667 9.99935 16.667ZM9.16602 12.5003H10.8327V14.167H9.16602V12.5003ZM10.8327 11.1296V11.667H9.16602V10.417C9.16602 9.95674 9.5391 9.58366 9.99935 9.58366C10.6897 9.58366 11.2493 9.02399 11.2493 8.33366C11.2493 7.6433 10.6897 7.08366 9.99935 7.08366C9.39293 7.08366 8.88735 7.51552 8.77335 8.08847L7.13877 7.76154C7.40466 6.42465 8.58435 5.41699 9.99935 5.41699C11.6102 5.41699 12.916 6.72283 12.916 8.33366C12.916 9.65491 12.0374 10.771 10.8327 11.1296Z"
                fill="#FB8441"
              />
            </svg>
            <Text fontWeight="500">Didn't remember</Text>
          </Flex>
        </Box>
        <Box
          position="relative"
          borderRadius="8px"
          backgroundColor="#207df7"
          width="218px"
          height="54px"
          color="#fff"
        >
          <Flex
            position="absolute"
            top="16.5px"
            left="calc(50% - 56.5px)"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            gap="8px"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4993 18.3337C5.89697 18.3337 2.16602 14.6027 2.16602 10.0003C2.16602 5.39795 5.89697 1.66699 10.4993 1.66699C15.1017 1.66699 18.8327 5.39795 18.8327 10.0003C18.8327 14.6027 15.1017 18.3337 10.4993 18.3337ZM10.4993 16.667C14.1813 16.667 17.166 13.6822 17.166 10.0003C17.166 6.31843 14.1813 3.33366 10.4993 3.33366C6.81745 3.33366 3.83268 6.31843 3.83268 10.0003C3.83268 13.6822 6.81745 16.667 10.4993 16.667ZM10.4993 8.82183L12.8563 6.46479L14.0348 7.6433L11.6778 10.0003L14.0348 12.3573L12.8563 13.5358L10.4993 11.1788L8.14232 13.5358L6.96382 12.3573L9.32085 10.0003L6.96382 7.6433L8.14232 6.46479L10.4993 8.82183Z"
                fill="#F53535"
              />
            </svg>
            <Text fontWeight="500">Got it wrong</Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default ConvertedComponent;
