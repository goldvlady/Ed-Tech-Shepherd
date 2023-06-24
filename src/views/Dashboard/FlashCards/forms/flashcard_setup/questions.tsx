import React, { useState } from "react";
import { useFlashCardState, FlashcardQuestion } from "../../context/flashcard";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";

const FlashCardQuestionsPage = () => {
  const { flashcardData, goToNextStep, setQuestions, questions } =
    useFlashCardState();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<FlashcardQuestion>({
    questionType: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: "",
  });

  const questionsCount = flashcardData.numOptions;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  const handleQuestionSubmit = () => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[currentQuestionIndex] = currentQuestion;
      return updatedQuestions;
    });
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setCurrentQuestion({
      questionType: "",
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      answer: "",
    });
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    setCurrentQuestion(questions[currentQuestionIndex - 1]);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    goToNextStep();
  };

  const isFinalQuestion = currentQuestionIndex === questionsCount - 1;

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel>Select question type:</FormLabel>
        <Select
          name="questionType"
          placeholder="e.g. Multiple choice"
          value={currentQuestion.questionType}
          onChange={handleChange}
        >
          <option value="multipleChoice">Multiple Choice</option>
          <option value="openEnded">Open Ended</option>
          <option value="trueFalse">True/False</option>
          <option value="fillTheBlank">Fill the Blank</option>
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Enter your question:</FormLabel>
        <Input
          type="textarea"
          _placeholder={{ fontSize: "14px", color: "#9A9DA2" }}
          name="question"
          placeholder="Enter your question here"
          value={currentQuestion.question}
          onChange={handleChange}
        />
      </FormControl>

      {currentQuestion.questionType === "multipleChoice" && (
        <>
          <FormControl mb={4}>
            <FormLabel>Option A:</FormLabel>
            <Input
              type="text"
              name="optionA"
              _placeholder={{ fontSize: "14px", color: "#9A9DA2" }}
              placeholder="Option A"
              value={currentQuestion.optionA}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Option B:</FormLabel>
            <Input
              type="text"
              name="optionB"
              _placeholder={{ fontSize: "14px", color: "#9A9DA2" }}
              placeholder="Option B"
              value={currentQuestion.optionB}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Option C:</FormLabel>
            <Input
              type="text"
              name="optionC"
              placeholder="Option C"
              _placeholder={{ fontSize: "14px", color: "#9A9DA2" }}
              value={currentQuestion.optionC}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Option D:</FormLabel>
            <Input
              type="text"
              name="optionD"
              placeholder="Option D"
              _placeholder={{ fontSize: "14px", color: "#9A9DA2" }}
              value={currentQuestion.optionD}
              onChange={handleChange}
            />
          </FormControl>
        </>
      )}

      <FormControl mb={4}>
        <FormLabel>Answer:</FormLabel>
        {currentQuestion.questionType === "multipleChoice" ? (
          <Select
            name="answer"
            placeholder="Select answer"
            value={currentQuestion.answer}
            onChange={handleChange}
          >
            <option value="optionA">Option A</option>
            <option value="optionB">Option B</option>
            <option value="optionC">Option C</option>
            <option value="optionD">Option D</option>
          </Select>
        ) : (
          <Input
            type="text"
            name="answer"
            placeholder="Enter the answer"
            value={currentQuestion.answer}
            onChange={handleChange}
          />
        )}
      </FormControl>

      <Button
        variant="solid"
        colorScheme="primary"
        onClick={handleQuestionSubmit}
        disabled={
          !currentQuestion.questionType ||
          !currentQuestion.question ||
          !currentQuestion.answer
        }
      >
        Add Question
      </Button>

      {currentQuestionIndex > 0 && (
        <Button
          variant="solid"
          colorScheme="primary"
          onClick={handlePreviousQuestion}
          mr={2}
        >
          Previous
        </Button>
      )}

      {isFinalQuestion ? (
        <Button variant="solid" colorScheme="primary" onClick={handleSubmit}>
          Create Flashcard
        </Button>
      ) : (
        <Button
          variant="solid"
          colorScheme="primary"
          onClick={() => {
            handleQuestionSubmit();
          }}
          ml={2}
        >
          Next Question
        </Button>
      )}
    </Box>
  );
};

export default FlashCardQuestionsPage;
