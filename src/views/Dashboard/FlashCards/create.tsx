import { FlashCardModal } from '../../../components/flashcardDecks';
import LoaderOverlay from '../../../components/loaderOverlay';
import ApiService from '../../../services/ApiService';
import flashcardStore from '../../../state/flashcardStore';
import userStore from '../../../state/userStore';
import FlashcardDataProvider from './context/flashcard';
import { useFlashCardState } from './context/flashcard';
import MnemonicSetupProvider from './context/mneomics';
import SetupFlashcardPage from './forms/flashcard_setup';
import SuccessState from './forms/flashcard_setup/success_page';
import MnemonicSetup from './forms/mneomics_setup';
import InitSetupPreview from './previews/init.preview';
import MnemonicPreview from './previews/mneomics.preview';
import QuestionsPreview from './previews/questions.preview';
import { useToast } from '@chakra-ui/react';
import { Box, HStack, Text, Radio, RadioGroup, VStack } from '@chakra-ui/react';
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  RefObject
} from 'react';
import styled from 'styled-components';

const Wrapper = styled(Box)`
  select {
    padding-bottom: 7px !important;
    height: 48px;
    border-radius: 6px;
    border: 1px solid #e4e5e7;
    background-color: #ffffff;
    box-shadow: 0 2px 6px 0 rgba(136, 139, 143, 0.1);
    font-size: 14px;
    line-height: 20px;
    color: #212224;
    margin-bottom: 10px;

    &::placeholder {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: -0.3%;
      color: #9a9da2 !important;
    }
  }
  select * {
    font-size: 14px !important;
    line-height: 20px !important;
    color: #212224 !important;
    border-radius: 4px !important;
    padding: 6px 8px 6px 6px !important;
    margin-bottom: 10px !important;
    background-color: #f2f4f8 !important;
  }

  /* Hover effect */
  select *:hover {
    background-color: #f2f4f8 !important;
  }
`;

export enum TypeEnum {
  FLASHCARD = 'flashcard',
  MNEOMONIC = 'mneomonic',
  INIT = 'init'
}

export enum SourceEnum {
  DOCUMENT = 'document',
  SUBJECT = 'subject',
  MANUAL = 'manual'
}

type SettingsType = {
  type: TypeEnum;
  source: SourceEnum;
};

const useBoxWidth = (ref: RefObject<HTMLDivElement>): number => {
  const [boxWidth, setBoxWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const newWidth = ref.current.offsetWidth;
        setBoxWidth(newWidth);
      }
    };

    // Initial width calculation
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return boxWidth;
};

const CreateFlashPage = () => {
  const toast = useToast();
  const { user } = userStore();
  const [settings, setSettings] = useState<SettingsType>({
    type: TypeEnum.INIT,
    source: SourceEnum.MANUAL
  });
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const boxWidth = useBoxWidth(wrapperRef);

  const {
    flashcardData,
    questions,
    goToNextStep,
    setQuestions,
    goToStep,
    setFlashcardData
  } = useFlashCardState();

  const { createFlashCard, flashcard, isLoading, fetchFlashcards } =
    flashcardStore();
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasSubmittedFlashCards, setHasSubmittedFlashCards] = useState(false);

  const { type: activeBadge } = settings;

  const setActiveBadge = (badge: TypeEnum) => {
    setSettings((value) => ({ ...value, type: badge }));
  };

  useEffect(() => {
    if (wrapperRef.current) {
      const wrapperWidth = wrapperRef.current.offsetWidth;
    }
  }, []);

  const generateFlashcard = useCallback(async () => {
    try {
      flashcardStore.setState({ isLoading: true });
      const aiData = {
        topic: flashcardData.topic,
        subject: flashcardData.subject,
        count:
          typeof flashcardData.numQuestions === 'string'
            ? parseInt(flashcardData.numQuestions)
            : flashcardData.numQuestions
      };

      const response = await ApiService.generateFlashcardQuestions(
        aiData,
        user?._id as string
      );
      if (response.status === 200) {
        const data = await response.json();
        const questions = data.map((d: any) => ({
          question: d.front,
          answer: d.back,
          questionType: 'openEnded'
        }));

        setQuestions(questions);
        setType(TypeEnum.FLASHCARD);
        goToNextStep();
        // fetchFlashcards();
        // setIsCompleted(true);
        toast({
          title: 'Flashcard questions generated succesfully',
          position: 'top-right',
          status: 'success',
          isClosable: true
        });
      } else {
        setHasSubmittedFlashCards(false);
        setFlashcardData((value) => ({ ...value, hasSubmitted: false }));

        toast({
          title: 'Failed to generate flashcard questions',
          position: 'top-right',
          status: 'success',
          isClosable: true
        });
      }
    } catch (error) {
      setHasSubmittedFlashCards(false);
      setFlashcardData((value) => ({ ...value, hasSubmitted: false }));
      toast({
        title: 'Failed to create flashcard, try again',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    } finally {
      flashcardStore.setState({ isLoading: false });
    }
  }, [
    flashcardData,
    goToNextStep,
    user,
    setQuestions,
    setHasSubmittedFlashCards,
    toast,
    setFlashcardData
  ]);

  const onSubmitFlashcard = useCallback(async () => {
    try {
      const response = await createFlashCard(
        { ...flashcardData, questions },
        'manual'
      );
      if (response) {
        if (response.status === 200) {
          fetchFlashcards();
          setIsCompleted(true);
          toast({
            title: 'Flash Card Created Successfully',
            position: 'top-right',
            status: 'success',
            isClosable: true
          });
        } else {
          setHasSubmittedFlashCards(false);
          setFlashcardData((value) => ({ ...value, hasSubmitted: false }));
          toast({
            title: 'Failed to create flashcard, try again',
            position: 'top-right',
            status: 'error',
            isClosable: true
          });
        }
      }
    } catch (error) {
      setHasSubmittedFlashCards(false);
      setFlashcardData((value) => ({ ...value, hasSubmitted: false }));
      toast({
        title: 'Failed to create flashcard, try again',
        position: 'top-right',
        status: 'error',
        isClosable: true
      });
    }
  }, [
    flashcardData,
    setHasSubmittedFlashCards,
    questions,
    toast,
    setFlashcardData,
    fetchFlashcards,
    createFlashCard
  ]);

  // const [activeBadge, setActiveBadge] = useState<TypeEnum>(TypeEnum.INIT);

  useEffect(() => {
    if (flashcardData.hasSubmitted && !hasSubmittedFlashCards) {
      setHasSubmittedFlashCards(true);
      if (settings.source === SourceEnum.SUBJECT) {
        generateFlashcard();
      }
      if (
        settings.type !== TypeEnum.FLASHCARD &&
        settings.type !== TypeEnum.INIT &&
        settings.source !== SourceEnum.MANUAL
      ) {
        setSettings((value) => ({ ...value, source: SourceEnum.MANUAL }));
      }
    }
  }, [
    flashcardData,
    hasSubmittedFlashCards,
    settings.type,
    settings.source,
    onSubmitFlashcard,
    generateFlashcard
  ]);

  const handleBadgeClick = (badge: TypeEnum) => {
    if (settings.source === SourceEnum.DOCUMENT && badge !== TypeEnum.FLASHCARD)
      return;
    setActiveBadge(badge);

    // if (badge === TypeEnum.MNEOMONIC) setSource(SourceEnum.MANUAL);
  };

  const setType = (type: TypeEnum) => {
    setSettings((val) => ({
      ...val,
      type
    }));
  };

  const setSource = (source: SourceEnum) => {
    setSettings((val) => ({
      ...val,
      source
    }));
  };

  const form = useMemo(() => {
    if (
      settings.type === TypeEnum.MNEOMONIC
    ) {
      return <MnemonicSetup />;
    }

    if (isCompleted) {
      return <SuccessState />;
    }
    if (
      (settings.type === TypeEnum.FLASHCARD ||
        settings.type === TypeEnum.INIT) &&
      settings.source === SourceEnum.MANUAL
    ) {
      return <SetupFlashcardPage />;
    }
    if (settings.source === SourceEnum.SUBJECT) {
      return <SetupFlashcardPage isAutomated />;
    }
    return <></>;
  }, [settings, isCompleted]); // The callback depends on 'settings'

  const renderPreview = () => {
    if (settings.type === TypeEnum.INIT) {
      return (
        <InitSetupPreview
          activeBadge={activeBadge}
          handleBadgeClick={handleBadgeClick}
        />
      );
    }
    if (settings.type === TypeEnum.FLASHCARD) {
      return (
        <QuestionsPreview
          isLoading={isLoading}
          onConfirm={() => onSubmitFlashcard()}
          activeBadge={activeBadge}
          handleBadgeClick={handleBadgeClick}
        ></QuestionsPreview>
      );
    }
    if (settings.type === TypeEnum.MNEOMONIC) {
      return (
        <MnemonicPreview
          activeBadge={activeBadge}
          handleBadgeClick={handleBadgeClick}
        ></MnemonicPreview>
      );
    }
  };
  return (
    <Box width={'100%'}>
      {isLoading && <LoaderOverlay />}
      <FlashCardModal isOpen={Boolean(flashcard)} />
      <Wrapper
        ref={wrapperRef}
        bg="white"
        width="100%"
        display="flex"
        position={'relative'}
        justifyContent="space-between"
        alignItems="center"
        minH="calc(100vh - 60px)"
      >
        <HStack
          justifyContent={'start'}
          alignItems={'start'}
          width="100%"
          display={'flex'}
          minH="calc(100vh - 60px)"
        >
          <VStack
            display={'flex'}
            justifyContent={'start'}
            alignItems={'center'}
            height="100%"
            flex="1"
            maxWidth={`${boxWidth / 2}px`}
            position={'relative'}
          >
            {activeBadge !== TypeEnum.MNEOMONIC && (
              <Box
                display={'flex'}
                borderBottom={'1px solid #E7E8E9'}
                flexDirection={'column'}
                width={'100%'}
                padding="30px"
              >
                <Text
                  fontFamily="Inter"
                  fontWeight="500"
                  fontSize="18px"
                  lineHeight="23px"
                  color="#212224"
                  mb={4}
                >
                  Select a Source
                </Text>
                <RadioGroup
                  onChange={(value: SourceEnum) => {
                    setSource(value as SourceEnum);
                    if (value === SourceEnum.SUBJECT) {
                      goToStep(0);
                      setFlashcardData((value) => ({
                        ...value,
                        hasSubmitted: false
                      }));
                      setHasSubmittedFlashCards(false);
                    }
                    if (value === SourceEnum.DOCUMENT) {
                      handleBadgeClick(TypeEnum.FLASHCARD);
                    }
                  }}
                  value={settings.source}
                >
                  <HStack align="start" spacing={7}>
                    <Radio value={SourceEnum.DOCUMENT}>
                      <Text color="#585F68">Document</Text>
                    </Radio>
                    <Radio value={SourceEnum.SUBJECT}>
                      <Text color="#585F68">Subject</Text>
                    </Radio>
                    <Radio value={SourceEnum.MANUAL}>
                      <Text color="#585F68">Manual</Text>
                    </Radio>
                  </HStack>
                </RadioGroup>
              </Box>
            )}
            <Box py="45px" paddingX={'30px'} width={'100%'}>
              {form}
            </Box>
          </VStack>
          {/* Render the right item here */}
          <VStack
            borderLeft="1px solid #E7E8E9"
            top="60px"
            width={`${boxWidth / 2}px`}
            maxWidth={`${boxWidth / 2}px`}
            right="0"
            bottom={'0'}
            position={'fixed'}
          >
            {renderPreview()}
          </VStack>
        </HStack>
      </Wrapper>
    </Box>
  );
};

const MainWrapper = () => {
  return (
    <FlashcardDataProvider>
      <MnemonicSetupProvider>
        <CreateFlashPage />
      </MnemonicSetupProvider>
    </FlashcardDataProvider>
  );
};

export default MainWrapper;
