import { useState, useEffect } from "react";
import SetupFlashcardPage from "./forms/flashcard_setup";
import InitSetupPreview from "./previews/init";
import FlashcardDataProvider from "./context/flashcard";
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

enum TypeEnum {
  FLASHCARD = "flashcard",
  MNEOMONIC = "mneomonic",
  INIT = "init",
}

enum SourceEnum {
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
  const [hasSubmittedFlashCards, setHasSubmittedFlashCards] = useState(false);
  const [activeBadge, setActiveBadge] = useState("");

  useEffect(() => {
    if (flashcardData.hasSubmitted && !hasSubmittedFlashCards) {
      setHasSubmittedFlashCards(true);
      if (settings.type !== TypeEnum.FLASHCARD) {
        setSettings((value) => ({ ...value, type: TypeEnum.FLASHCARD }));
      }
    }
  }, [flashcardData, hasSubmittedFlashCards, settings.type]);

  const handleBadgeClick = (badge: string) => {
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

  const renderForms = () => {
    if (
      (settings.type === TypeEnum.FLASHCARD ||
        settings.type === TypeEnum.INIT) &&
      settings.source === SourceEnum.MANUAL
    ) {
      return <SetupFlashcardPage />;
    }
  };

  const renderPreview = () => {
    if (settings.type === TypeEnum.INIT) {
      return (
        <InitSetupPreview
          activeBadge={activeBadge}
          handleBadgeClick={handleBadgeClick}
        />
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
      <HStack width="100%">
        <Box px={10} minH="calc(100vh - 130px)" height="100%" width="50%">
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
          <Box
            bg="white"
            boxShadow="md"
            marginTop="30px"
            width="100%"
            padding="30px"
            height="calc(100vh - 100px)"
            overflowY="auto"
          >
            {renderForms()}
          </Box>
        </Box>

        <Box
          minH="calc(100vh - 130px)"
          height="100%"
          borderLeft="1px solid #E7E8E9"
          width="50%"
          padding="20px"
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
      <CreateFlashPage />
    </FlashcardDataProvider>
  );
};

export default MainWrapper;
