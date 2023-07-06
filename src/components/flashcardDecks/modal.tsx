import React, { useMemo, useState, useEffect } from "react";
import _ from "lodash";
import { FlashcardData } from "../../types";
import flashcardStore from "../../state/flashcardStore";
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Modal,
  Icon,
  ModalOverlay,
  ModalContent,
  MenuItem,
  MenuList,
  MenuButton,
  Menu,
  Spinner,
  MenuGroup,
} from "@chakra-ui/react";
import { FiCheck, FiHelpCircle, FiXCircle } from "react-icons/fi";
import { AiFillThunderbolt } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import DeckOverLap from "./overlap";
import FlashCard from "./deck_two";
import styled from "styled-components";

const MenuListWrapper = styled(MenuList)`
  .chakra-menu__group__title {
    margin: 0 !important;
  }
`;

let INITIAL_TIMER = 0;

const LoaderOverlay = () => (
  <div
    style={{
      position: "absolute",
      zIndex: 1,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    }}
  >
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  </div>
);

export interface Options {
  type: "single" | "multiple";
  content: string[];
}

export interface Study {
  id: number;
  type: "timed" | "manual";
  questions: string;
  answers: string | string[];
  currentStep: number;
  isFirstAttempt: boolean;
  options?: Options;
}

const EmptyState = ({ onStart }: { onStart: () => void }) => {
  return (
    <Box
      borderRadius="12px"
      minWidth={{ base: "80%", md: "600px" }}
      display={"flex"}
      height="500px"
      flexDirection={"column"}
      width="auto"
      justifyContent={"center"}
      alignItems={"center"}
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke-width="1"
        fill="#D4AF37" // Set stroke to gold
        style={{ width: "150px", height: "150px" }} // Increase size to 6em (96px) or 150px based on your requirement
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>

      <Text
        marginBottom={"40px"}
        marginTop="10px"
        fontSize="18px"
        width="70%"
        color="#6E7682"
        lineHeight="22px"
        textAlign="center"
      >
        Click the "Study" button to start. Set study settings before you start
      </Text>

      <Button
        bg="#207DF7"
        width={"80%"}
        color="white"
        borderRadius="8px"
        onClick={() => onStart()}
        border="1px solid #207DF7"
        height="48px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text
          fontSize="14px"
          fontWeight="500"
          lineHeight="22px"
          textAlign="center"
        >
          Study
        </Text>
      </Button>
    </Box>
  );
};

const CompletedState = ({
  onDone,
  score,
}: {
  onDone: () => void;
  score: number;
}) => {
  return (
    <Box
      borderRadius="12px"
      minWidth={{ base: "80%", md: "600px" }}
      display={"flex"}
      height="500px"
      flexDirection={"column"}
      width="auto"
      justifyContent={"center"}
      alignItems={"center"}
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
    >
      <Text
        marginBottom={"20px"}
        fontSize="36px"
        fontWeight={"500"}
        width="70%"
        color="#000"
        lineHeight="22px"
        textAlign="center"
      >
        {score}
      </Text>

      <Text
        marginBottom={"40px"}
        marginTop="10px"
        fontSize="18px"
        width="70%"
        color="#6E7682"
        lineHeight="22px"
        textAlign="center"
      >
        Your Study for Today is Done, Here is your Score
      </Text>

      <Button
        bg="#207DF7"
        width={"80%"}
        color="white"
        borderRadius="8px"
        onClick={() => onDone()}
        border="1px solid #207DF7"
        height="48px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text
          fontSize="14px"
          fontWeight="500"
          lineHeight="22px"
          textAlign="center"
        >
          Done
        </Text>
      </Button>
    </Box>
  );
};

const StudyBox = () => {
  const [studyState, setStudyState] = useState<"question" | "answer">(
    "question"
  );
  const {
    flashcard,
    storeScore,
    updateQuestionAttempt,
    isLoading,
    loadFlashcard,
  } = flashcardStore();
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);
  const [studyType, setStudyType] = useState<"manual" | "timed">("manual");
  const [{ isStarted, isFinished }, setActivityState] = useState({
    isStarted: false,
    isFinished: false,
  });
  const [progressWidth, setProgressWidth] = useState("100%");
  const [studies, setStudies] = useState<Study[]>([] as Study[]);
  const [cardStyle, setCardStyle] = useState<"flippable" | "default">(
    "default"
  );
  const [timer, setTimer] = useState(0);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);

  const formatFlashcard = (flashcard: FlashcardData) => {
    const formatedQuestions: Study[] = flashcard.questions.map(
      (question, index) => {
        const data: Study = {
          id: index + 1,
          type: studyType,
          questions: question.question,
          answers: question.answer,
          currentStep: question.currentStep,
          isFirstAttempt: question.numberOfAttempts === 0,
        };
        if (question.options || question.questionType === "trueFalse") {
          if (question.questionType === "trueFalse") {
            data.options = {
              type: "single",
              content: ["true", "false"],
            };
          } else {
            if (question.options?.length) {
              data.options = {
                type: "single",
                content: question?.options,
              };
            }
          }
        }
        return data;
      }
    );
    return formatedQuestions;
  };

  useEffect(() => {
    if (flashcard) {
      setStudies(formatFlashcard(flashcard));
    }
  }, [flashcard, studyType]);

  console.log(studies);

  const currentStudy = useMemo(
    () => studies[currentStudyIndex],
    [currentStudyIndex, studies, studyType]
  );

  console.log(currentStudy);

  useEffect(() => {
    setStudyState("question");
    setProgressWidth("100%");
  }, [currentStudyIndex]);

  const lazyTriggerNextStep = async () => {
    if (currentStudyIndex === studies.length - 1) {
      if (flashcard) await storeScore(flashcard?._id, correctAnswerCount);
      setTimeout(
        () => setActivityState({ isFinished: true, isStarted: false }),
        2000
      );
    } else {
      setTimeout(() => setCurrentStudyIndex((prev) => prev + 1), 2000);
    }
  };

  useEffect(() => {
    let countdown;
    if (INITIAL_TIMER === 0) {
      INITIAL_TIMER = timer;
    }
    console.log(INITIAL_TIMER);

    if (isStarted && studyType === "timed") {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          // Calculate progress bar width
          const newWidth = `${(newTimer / INITIAL_TIMER) * 100}%`;
          setProgressWidth(newWidth);
          return newTimer;
        });
      }, 1000);
    }

    if (timer === 0 && studyType === "timed" && studyState === "question") {
      setTimer(INITIAL_TIMER);
      INITIAL_TIMER = 0;
      clearInterval(countdown);
      setStudyState("answer");
    }

    return () => clearInterval(countdown);
  }, [isStarted, timer, studyType]);

  const acceptAnswer = async () => {
    if (flashcard)
      await updateQuestionAttempt(flashcard._id, currentStudy.questions, true);
    setStudies((prev) => {
      const curr = prev[currentStudyIndex];
      curr.currentStep = curr.currentStep + 1;
      prev[currentStudyIndex] = curr;
      setCorrectAnswerCount((prev) => prev + 1);
      return [...prev];
    });
    lazyTriggerNextStep();
  };

  const rejectAnswer = async () => {
    if (flashcard)
      await updateQuestionAttempt(flashcard._id, currentStudy.questions, false);
    setStudies((prev) => {
      const curr = prev[currentStudyIndex];
      curr.isFirstAttempt = false;
      prev[currentStudyIndex] = curr;
      return [...prev];
    });
    lazyTriggerNextStep();
  };

  const questionsLeft = (
    <Box
      width="22px"
      height="22px"
      borderRadius="22px"
      border="1px solid rgba(255, 255, 255, 0.15)"
      background="rgba(255, 255, 255, 0.15)"
      color="#FFF"
      fontSize="12px"
      fontFamily="Inter"
      fontWeight="600"
      lineHeight="17px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {studies.length - currentStudyIndex - 1}
    </Box>
  );

  const renderMainBox = () => {
    return isFinished ? (
      <CompletedState
        onDone={() => loadFlashcard(null)}
        score={correctAnswerCount}
      />
    ) : (
      <Box width="100%" flexDirection={"column"} display={"flex"}>
        <Box width="100%" height="500px">
          <Box
            position="absolute"
            top="150px"
            left="50%"
            transform="translateX(-50%)"
            width="340px"
            height="374px"
            fontSize="sub3Size"
            color="text.400"
          >
            <DeckOverLap
              top="30px"
              left="50%"
              width="256px"
              height="344px"
              boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
              backgroundColor={studyState === "answer" ? "#F9FAFB" : "#fff"}
            >
              {/* Content for frame-child5 */}
            </DeckOverLap>
            <DeckOverLap
              top="20px"
              left="50%"
              width="284px"
              height="344px"
              boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
              backgroundColor={studyState === "answer" ? "#F9FAFB" : "#fff"}
            >
              {/* Content for frame-child6 */}
            </DeckOverLap>
            <DeckOverLap
              top="10px"
              left="50%"
              width="312px"
              height="344px"
              boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
              backgroundColor={studyState === "answer" ? "#F9FAFB" : "#fff"}
            >
              {/* Content for frame-child7 */}
            </DeckOverLap>
            <FlashCard
              cardStyle={cardStyle}
              study={currentStudy}
              onNewResult={(selectedOpions) => {
                console.log(currentStudy.answers, "options", selectedOpions);
                const isCorrect =
                  typeof currentStudy.answers === "string"
                    ? currentStudy.answers === selectedOpions
                    : _.isEqual(currentStudy.answers, selectedOpions);
                isCorrect ? acceptAnswer() : rejectAnswer();
              }}
              studyState={studyState}
              position="absolute"
              top="0"
              borderRadius="5px"
              background={
                studyState === "answer" || cardStyle === "default"
                  ? "#F9FAFB"
                  : "#fff"
              }
              boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
              height="344px"
              overflow="hidden"
              left="50%"
              transform="translateX(-50%)"
              width="340px"
            />
          </Box>
        </Box>
        {studyState === "question" ? (
          currentStudy.type !== "timed" ? (
            <Box
              width={"100%"}
              display="flex"
              justifyContent={"center"}
              px="30px"
              pb="40px"
            >
              <Button
                onClick={() => {
                  setStudyState("answer");
                  // if(currentStudy.options){
                  //     lazyTriggerNextStep()
                  // }
                }}
                bg="#207DF7"
                width={"80%"}
                color="white"
                borderRadius="8px"
                border="1px solid #207DF7"
                height="48px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                <Text
                  fontSize="14px"
                  fontWeight="500"
                  lineHeight="22px"
                  textAlign="center"
                >
                  Show Answer
                </Text>
              </Button>
            </Box>
          ) : (
            <Box
              width={"100%"}
              display="flex"
              justifyContent={"center"}
              height="48px"
              px="30px"
              pb="40px"
            ></Box>
          )
        ) : (
          !currentStudy?.options && (
            <Box
              width="100%"
              display="flex"
              justifyContent="space-between"
              px="20px"
              pb="40px"
            >
              <Button
                leftIcon={<Icon as={FiCheck} fontSize={"16px"} />}
                borderRadius="8px"
                onClick={() => {
                  acceptAnswer();
                  // setStudies(prev => {
                  //     const curr = prev[currentStudyIndex]
                  //     curr.currentStep = curr.currentStep + 1
                  //     prev[currentStudyIndex] = curr
                  //     return [...prev]
                  // })
                  // setCorrectAnswerCount(prev => prev + 1)
                  // lazyTriggerNextStep()
                }}
                flex="1"
                fontSize="16px"
                backgroundColor="#EDF7EE"
                padding="16.5px 45.5px 16.5px 47.5px"
                boxShadow="0px 2px 6px 0px rgba(136, 139, 143, 0.10)"
                color="#4CAF50"
                marginRight="10px"
                height="54px"
                transition="transform 0.3s"
                _hover={{
                  background: "#EDF7EE",
                  transform: "scale(1.05)",
                }}
              >
                Got it right
              </Button>

              <Button
                leftIcon={<Icon as={FiHelpCircle} fontSize={"16px"} />}
                borderRadius="8px"
                padding="16.5px 45.5px 16.5px 47.5px"
                backgroundColor="#FFEFE6"
                color="#FB8441"
                flex="1"
                fontSize="16px"
                marginRight="10px"
                onClick={() => {
                  rejectAnswer();
                  // setStudies(prev => {
                  //     const curr = prev[currentStudyIndex]
                  //     curr.isFirstAttempt = false
                  //     prev[currentStudyIndex] = curr
                  //     return [...prev]
                  // })
                  // lazyTriggerNextStep()
                }}
                height="54px"
                transition="transform 0.3s"
                _hover={{
                  background: "#FFEFE6",
                  transform: "scale(1.05)",
                }}
              >
                Didn’t remember
              </Button>

              <Button
                leftIcon={<Icon as={FiXCircle} fontSize={"16px"} />}
                display="flex"
                padding="16.5px 45.5px 16.5px 47.5px"
                justifyContent="center"
                alignItems="center"
                borderRadius="8px"
                fontSize="16px"
                backgroundColor="#FEECEC"
                color="#F53535"
                flex="1"
                height="54px"
                onClick={() => {
                  rejectAnswer();
                  // setStudies(prev => {
                  //     const curr = prev[currentStudyIndex]
                  //     curr.isFirstAttempt = false
                  //     prev[currentStudyIndex] = curr
                  //     return [...prev]
                  // })
                  // lazyTriggerNextStep()
                }}
                transition="transform 0.3s"
                _hover={{
                  background: "#FEECEC",
                  transform: "scale(1.05)",
                }}
              >
                Got it wrong
              </Button>
            </Box>
          )
        )}
      </Box>
    );
  };
  return (
    <Box
      padding={0}
      borderRadius="12px"
      minWidth={{ base: "80%", md: "700px" }}
      width="auto"
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
    >
      <Flex
        width="full"
        padding={{ base: "20px 15px", md: "20px" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack spacing={4} alignItems="center">
          <Text
            fontFamily="Inter"
            fontWeight="500"
            fontSize="16px"
            lineHeight="21px"
            letterSpacing="0.7%"
            color="#212224"
          >
            Study Session
          </Text>
          <Text
            fontFamily="Inter"
            fontWeight="400"
            fontSize="12px"
            lineHeight="17px"
            color="#585F68"
            bg="#F4F5F6"
            borderRadius="4px"
            padding="8px"
          >
            {flashcard?.deckname}
          </Text>
        </HStack>
        <HStack spacing={4} alignItems="center">
          <Button
            leftIcon={
              isStarted ? (
                questionsLeft
              ) : (
                <AiFillThunderbolt
                  style={{ marginTop: "4px" }}
                  fontSize={"24px"}
                  color="white"
                />
              )
            }
            padding="8px 32px"
            borderRadius="8px"
            bg={isStarted ? "#F53535" : "#207DF7"}
            color="#FFF"
            fontSize="14px"
            border="none"
            fontWeight="500"
            lineHeight="19px"
            _hover={{
              bg: isStarted ? "#F53535" : "#207DF7", // Remove hover color change
              transform: "scale(1.05)", // Add hover size increase
            }}
            _active={{
              borderColor: "none", // Remove active border
              boxShadow: "none", // Remove active shadow
            }}
            onClick={() =>
              setActivityState((prev) => ({
                ...prev,
                isStarted: !prev.isStarted,
              }))
            }
          >
            {isStarted ? "Stop" : "Study"}
          </Button>
          <Menu>
            <MenuButton
              as={Button}
              variant="unstyled"
              borderRadius="full"
              p={0}
              minW="auto"
              height="auto"
            >
              <BsThreeDots size="16px" />
            </MenuButton>
            <MenuListWrapper
              fontSize="14px"
              minWidth={"185px"}
              borderRadius="8px"
              backgroundColor="#FFFFFF"
              boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
            >
              <MenuGroup margin={0} title="Timer">
                <MenuItem
                  p="6px 8px 6px 8px"
                  pl="15px"
                  background={
                    INITIAL_TIMER === 30 || timer === 30 ? "#F2F4F7" : "#fff"
                  }
                  _hover={{ bgColor: "#F2F4F7" }}
                  onClick={() => {
                    setTimer(30);
                    setStudyType("timed");
                  }}
                >
                  30 secs
                </MenuItem>
                <MenuItem
                  p="6px 8px 6px 8px"
                  pl="15px"
                  background={
                    INITIAL_TIMER === 60 || timer === 60 ? "#F2F4F7" : "#fff"
                  }
                  _hover={{ bgColor: "#F2F4F7" }}
                  onClick={() => {
                    setTimer(60);
                    setStudyType("timed");
                  }}
                >
                  1 minute
                </MenuItem>
                <MenuItem
                  p="6px 8px 6px 8px"
                  pl="15px"
                  background={studyType === "manual" ? "#F2F4F7" : "#fff"}
                  _hover={{ bgColor: "#F2F4F7" }}
                  onClick={() => {
                    setTimer(0);
                    setStudyType("manual");
                  }}
                >
                  None
                </MenuItem>
              </MenuGroup>
              <MenuGroup title="Card Style">
                <MenuItem
                  p="6px 8px 6px 8px"
                  pl="15px"
                  background={cardStyle === "default" ? "#F2F4F7" : "#fff"}
                  _hover={{ bgColor: "#F2F4F7" }}
                  onClick={() => setCardStyle("default")}
                >
                  Default
                </MenuItem>
                <MenuItem
                  p="6px 8px 6px 8px"
                  pl="15px"
                  background={cardStyle === "flippable" ? "#F2F4F7" : "#fff"}
                  _hover={{ bgColor: "#F2F4F7" }}
                  onClick={() => setCardStyle("flippable")}
                >
                  Flippable
                </MenuItem>
              </MenuGroup>
            </MenuListWrapper>
          </Menu>
        </HStack>
      </Flex>
      <Box position="relative" width="100%" height="2px">
        <Box
          className="progress-bar-base"
          position="absolute"
          width="100%"
          height="2px"
          bg="#EEEFF2"
          borderRadius="2px"
        />
        <Box
          className="progress-bar"
          position="absolute"
          width={progressWidth}
          height="2px"
          bg={
            timer <= 10 && isStarted && currentStudy.type === "timed"
              ? "#F53535"
              : "#207DF7"
          }
          borderRadius="2px"
          transition="width 0.5s linear" // Add this line
        />
      </Box>
      {isLoading && <LoaderOverlay />}
      {!isStarted && !isFinished ? (
        <EmptyState
          onStart={() =>
            setActivityState({ isStarted: true, isFinished: false })
          }
        />
      ) : (
        renderMainBox()
      )}
    </Box>
  );
};

const FlashCardModal = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered>
      <ModalOverlay />
      <ModalContent
        minWidth={{ base: "80%", md: "700px" }}
        mx="auto"
        w="fit-content"
      >
        <StudyBox />
      </ModalContent>
    </Modal>
  );
};

export default FlashCardModal;
