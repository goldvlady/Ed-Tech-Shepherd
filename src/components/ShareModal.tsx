import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Text,
  Box,
  extendTheme,
  ChakraProvider
} from '@chakra-ui/react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { copyTextToClipboard } from '../helpers/copyTextToClipboard';
import { useCustomToast } from './CustomComponents/CustomToast/useCustomToast';
import { RiShareForwardLine, RiTwitterXLine } from '@remixicon/react';
import { newId } from '../helpers/id';
// import {
//   MultiSelect,
//   MultiSelectProps,
//   MultiSelectTheme,
//   SelectionVisibilityMode,
//   useMultiSelect
// } from 'chakra-multiselect';
import { MultiSelect } from 'react-multi-select-component';

import ApiService from '../services/ApiService';
import useResourceStore from '../state/resourceStore';
import clientStore from '../state/clientStore';
import { Item } from '@radix-ui/react-radio-group';

type ShareModalProps = {
  type:
    | 'quiz'
    | 'note'
    | 'flashcard'
    | 'docchat'
    | 'aichat'
    | 'tutor'
    | 'school'
    | 'studyPlan';
  customTriggerComponent?: React.ReactNode;
  prefferredBaseUrl?: string;
};

interface ModalContentLayoutProps {
  headerTitle: string;
  bodyText: string;
  presentableLink: string;
  copyShareLink: () => void;
  shareOnX: () => void;
}

const appendParamsToUrl = (baseUrl, paramsToAppend) => {
  const url = new URL(baseUrl);
  const existingParams = new URLSearchParams(url.search);

  const paramsToExclude = ['shareable', 'apiKey'];

  paramsToExclude.forEach((param) => {
    existingParams.delete(param);
  });

  const updatedParams = new URLSearchParams([
    ...existingParams,
    ...paramsToAppend
  ]);

  url.search = updatedParams.toString();

  return url.toString();
};
const ShareModal = ({
  type,
  customTriggerComponent,
  prefferredBaseUrl
}: ShareModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shareLink, setShareLink] = useState('');
  const [presentableLink, setPresentableLink] = useState('');
  const toast = useCustomToast();

  const generateShareLink = () => {
    const apiKey = newId('shep');
    const url = prefferredBaseUrl || window.location.href;
    const shareLink = appendParamsToUrl(
      window.location.href,
      new URLSearchParams([
        ['shareable', 'true'],
        ['apiKey', apiKey]
      ])
    ).replace('/tutordashboard', '');
    setPresentableLink(shareLink.split('dashboard').at(-1));
    setShareLink(shareLink);
    setTimeout(() => {
      onOpen();
    }, 500);
  };
  const copyShareLink = useCallback(async () => {
    try {
      await copyTextToClipboard(shareLink);
      toast({
        title: 'Share Link Copied 🎊',
        description: 'Successfully copied custom share link',
        status: 'success',
        position: 'bottom-right'
      });
      const apiKey = shareLink.split('apiKey=').at(-1);
      await ApiService.generateShareLink({ apiKey });
    } catch (error) {
      toast({
        title: 'Something went wrong creating your share link',
        status: 'error',
        position: 'bottom-right'
      });
    }
  }, [shareLink, toast]);

  const shareOnX = useCallback(async () => {
    let tweetBaseText = '';

    switch (type) {
      case 'note':
        tweetBaseText = 'Check out my note on shepherd.study!';
        break;
      case 'quiz':
        tweetBaseText = 'Check out my quiz on shepherd.study!';
        break;
      case 'aichat':
      case 'docchat':
        tweetBaseText = 'Check out my conversation on shepherd.study!';
        break;
      case 'studyPlan':
        tweetBaseText = 'Check out my study plan on shepherd.study!';
        break;
      default:
        tweetBaseText = 'Book a session!';
        break;
    }

    const encodedTweetText = encodeURIComponent(
      `${tweetBaseText} ${shareLink}`
    );
    const tweetIntentURL = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;

    window.open(tweetIntentURL, '_blank');
    const apiKey = shareLink.split('apiKey=').at(-1);
    await ApiService.generateShareLink({ apiKey });
  }, [shareLink, type]);

  const modalContent = useMemo(() => {
    const headerTitles = {
      note: 'Share this Note',
      quiz: 'Share this Quiz',
      aichat: 'Share this Conversation',
      docchat: 'Share this Conversation',
      tutor: 'Share this Tutor',
      studyPlan: 'Share this Study Plan'
    };

    const bodyTexts = {
      note: 'Anyone with this link can view your note.',
      quiz: 'Anyone with this link can view your quiz.',
      aichat: 'Anyone with this link can view your conversation.',
      docchat:
        'Anyone with this link can view your conversation with your document.',
      tutor: 'Anyone with this link can view this tutor.',
      studyPlan: 'Anyone with this link can view this study plan.'
    };

    return (
      <ModalContentLayout
        headerTitle={headerTitles[type]}
        bodyText={bodyTexts[type]}
        presentableLink={presentableLink}
        copyShareLink={copyShareLink}
        shareOnX={shareOnX}
      />
    );
  }, [type, presentableLink, copyShareLink, shareOnX]);

  return (
    <>
      {customTriggerComponent ? (
        <div onClick={generateShareLink}>{customTriggerComponent}</div>
      ) : type === 'docchat' ? (
        <Button
          onClick={generateShareLink}
          bg="#f4f4f5"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="4px"
          padding="10px"
          borderRadius="md"
          border="none"
          cursor="pointer"
          color="#000"
          _hover={{ bg: '#e4e4e5' }}
          _active={{ bg: '#d4d4d5' }}
        >
          <RiShareForwardLine />
        </Button>
      ) : (
        <Button
          onClick={generateShareLink}
          bg="#f4f4f5"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="4px"
          padding="12px 24px"
          borderRadius="md"
          border="none"
          cursor="pointer"
          color="#000"
          _hover={{ bg: '#e4e4e5' }}
          _active={{ bg: '#d4d4d5' }}
        >
          <span> Share</span>
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
            />
          </svg>
        </Button>
      )}
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        {modalContent}
      </Modal>
    </>
  );
};

export default ShareModal;

const ModalContentLayout = ({
  headerTitle,
  bodyText,
  presentableLink,
  copyShareLink,
  shareOnX
}) => {
  const [selectedUser, setSelectedUser] = useState([]); // New state to hold selected user
  const { studyPlanCourses } = useResourceStore();
  const { fetchSchoolTutorStudents, schoolStudents } = clientStore();

  const studentOptions: any =
    schoolStudents?.map((item: any, index) => ({
      id: item.user?.id,
      value: `${item.user?.name.first} ${item.user?.name.last}`,
      label: `${item.user?.name.first} ${item.user?.name.last}`
    })) || [];
  const handleSelectedUser = (selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedSubjects = selectedOptions
      .map((option) => option.value)
      .join(',');
  };
  return (
    <ModalContent>
      <ModalHeader>{headerTitle}</ModalHeader>
      <ModalCloseButton />
      <ModalBody
        pt="10px"
        p="0"
        px="24px"
        className="flex !items-start !justify-start flex-col gap-3"
      >
        <p>{bodyText}</p>
        <Box
          bg="transparent"
          outline="none"
          _focus={{ boxShadow: 'none' }}
          cursor="not-allowed"
          padding="8px 12px"
          maxHeight={'40px'}
          width="100%"
          boxShadow="inset 0 0 0 1px #E4E6E7" // Updated border color
          borderRadius="md"
          className="text-balance overflow-scroll"
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          <Text
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
            whiteSpace={'nowrap'}
          >
            {presentableLink}
          </Text>
        </Box>

        <div className="flex gap-2 mt-2">
          <Button
            onClick={copyShareLink}
            bg="#f4f4f5"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="4px"
            padding="12px 14px"
            borderRadius="md"
            border="none"
            cursor="pointer"
            color="#000"
            _hover={{ bg: '#e4e4e5' }}
            _active={{ bg: '#d4d4d5' }}
          >
            <DocumentDuplicateIcon width={16} height={16} />
            <span> Copy link</span>
          </Button>
          <Button
            onClick={shareOnX}
            bg="#f4f4f5"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="4px"
            padding="12px 18px"
            borderRadius="md"
            border="none"
            cursor="pointer"
            color="#000"
            _hover={{ bg: '#e4e4e5' }}
            _active={{ bg: '#d4d4d5' }}
          >
            <span> Share on </span>
            <RiTwitterXLine style={{ width: '16px', height: '16px' }} />
          </Button>
        </div>
        <Box
          w="full"
          my={10}
          style={{ minHeight: '120px' }} // Ensure enough height for the multiselect
        >
          <MultiSelect
            options={studentOptions}
            value={selectedUser}
            onChange={handleSelectedUser}
            labelledBy="Select"
            valueRenderer={() => (
              <span
                style={{
                  color: '#8c8c8c',
                  fontSize: '0.875rem',
                  width: '100%'
                }}
              >
                Search Students
              </span>
            )}
          />
        </Box>
      </ModalBody>
    </ModalContent>
  );
};
