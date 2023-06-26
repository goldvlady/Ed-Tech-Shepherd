import { useState, useEffect, useCallback } from "react";
import SetupFlashcardPage from "./forms/flashcard_setup";
import SuccessState from "./forms/flashcard_setup/success_page";
import MnemonicSetup from "./forms/mneomics_setup";
import InitSetupPreview from "./previews/init.preview";
import MnemonicPreview from "./previews/mneomics.preview";
import QuestionsPreview from "./previews/questions.preview";
import FlashcardDataProvider from "./context/flashcard";
import MnemonicSetupProvider from "./context/mneomics";
import { useFlashCardState } from "./context/flashcard";
import { Box, HStack, Text, Radio, RadioGroup } from "@chakra-ui/react";

import styled from "styled-components";

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
  FLASHCARD = "flashcard",
  MNEOMONIC = "mneomonic",
  INIT = "init",
}

export enum SourceEnum {
  DOCUMENT = "document",
  SUBJECT = "subject",
  MANUAL = "manual",
}

type SettingsType = {
  type: TypeEnum;
  source: SourceEnum;
};

const CreateFlashPage = () => {
  const [settings, setSettings] = useState<SettingsType>({
    type: TypeEnum.INIT,
    source: SourceEnum.MANUAL,
  });
  const { flashcardData } = useFlashCardState();
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasSubmittedFlashCards, setHasSubmittedFlashCards] = useState(false);

  const { type: activeBadge } = settings;

  console.log(activeBadge);

  const setActiveBadge = (badge: TypeEnum) => {
    setSettings((value) => ({ ...value, type: badge }));
  };
  // const [activeBadge, setActiveBadge] = useState<TypeEnum>(TypeEnum.INIT);

  useEffect(() => {
    if (flashcardData.hasSubmitted && !hasSubmittedFlashCards) {
      setHasSubmittedFlashCards(true);
      if (settings.source === SourceEnum.SUBJECT) {
        setIsCompleted(true);
      }
      if (
        settings.type !== TypeEnum.FLASHCARD &&
        settings.source === SourceEnum.MANUAL
      ) {
        setSettings((value) => ({ ...value, type: TypeEnum.FLASHCARD }));
      }
    }
  }, [flashcardData, hasSubmittedFlashCards, settings.type]);

  const handleBadgeClick = (badge: TypeEnum) => {
    setActiveBadge(badge);
  };

  const setType = (type: TypeEnum) => {
    setSettings((val) => ({
      ...val,
      type,
    }));
  };

  const setSource = (source: SourceEnum) => {
    setSettings((val) => ({
      ...val,
      source,
    }));
  };

  const renderForms = useCallback(() => {
    if (isCompleted) {
      return <SuccessState />;
    }
    if (
      settings.type === TypeEnum.MNEOMONIC &&
      settings.source === SourceEnum.MANUAL
    ) {
      return <MnemonicSetup />;
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
          onConfirm={() => setIsCompleted(true)}
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
    <Wrapper
      bg="white"
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <HStack
        justifyContent={"start"}
        alignItems={"start"}
        width="100%"
        minH="calc(100vh - 60px)"
      >
        <Box p="60px" height="100%" width="50%">
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
            onChange={(value) => setSource(value as SourceEnum)}
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
          <Box mt="20px" pr="20px" width="100%">
            {renderForms()}
          </Box>
        </Box>

        <Box
          position="fixed"
          top="60px"
          bottom="0"
          right="0"
          borderLeft="1px solid #E7E8E9"
          width="45%"
          paddingTop={"20px"}
        >
          {renderPreview()}
        </Box>
      </HStack>
    </Wrapper>
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
