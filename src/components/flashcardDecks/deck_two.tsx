import StepIndicator from './flashcards_steps_indicator';
import { Study } from './modal';
import {
  Box as ChakraBox,
  BoxProps as ChakraBoxProps,
  Text,
  Radio,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import styled from 'styled-components';
import Typewriter from 'typewriter-effect';

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

const HiddenCheckbox = styled.input.attrs<{ checked: boolean }>(
  ({ checked }) => ({
    type: 'checkbox',
    checked: checked
  })
)<{
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}>`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

interface StyledCheckboxProps {
  checked: boolean;
}

const StyledCheckbox = styled.div<StyledCheckboxProps>`
  display: flex;
  width: 15px;
  height: 15px;
  background: ${(props) =>
    props.checked ? 'var(--primary-color-300, #207DF7)' : '#FFF'};
  border: 1.3px solid #d6d8e0;
  border-radius: 4px;
  transition: all 150ms;

  ${Icon} {
    visibility: ${(props) => (props.checked ? 'visible' : 'hidden')};
  }
`;

interface CheckboxProps {
  className?: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  className,
  checked,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current && props.onChange) {
      const newValue = !inputRef.current.checked;
      inputRef.current.checked = newValue;
      const mockEvent = {
        target: inputRef.current,
        currentTarget: inputRef.current
      };
      props.onChange(mockEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <CheckboxContainer className={className} onClick={handleClick}>
      <HiddenCheckbox ref={inputRef} checked={checked} {...props} />
      <StyledCheckbox checked={checked}>
        <Icon viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </Icon>
      </StyledCheckbox>
    </CheckboxContainer>
  );
};

interface FlashCardProps extends ChakraBoxProps {
  height: string;
  width: string;
  study: Study;
  studyState: 'question' | 'answer';
  cardStyle: 'flippable' | 'default';
  onNewResult?: (selectedOptions: string | string[]) => void;
}

const FlashCard: React.FC<FlashCardProps> = ({
  height,
  study,
  width,
  studyState,
  cardStyle,
  onNewResult,
  ...rest
}) => {
  const controls = useAnimation();
  const [isFlipped, setIsFlipped] = useState(false);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const questionText = useMemo(() => {
    return (
      <Typewriter
        key={study?.questions}
        options={{
          delay: 10,
          autoStart: true,
          loop: false,
          skipAddStyles: true,
          wrapperClassName: 'text-base'
        }}
        onInit={(typewriter) => {
          typewriter.typeString(study.questions).start();
        }}
      />
    );
  }, [study.questions]);

  const answerText = useMemo(() => {
    return (
      <Typewriter
        key={study?.answers as string}
        options={{
          delay: 10,
          autoStart: true,
          loop: false,
          skipAddStyles: true,
          wrapperClassName: 'text-base'
        }}
        onInit={(typewriter) => {
          typewriter.typeString(study.answers as string).start();
        }}
      />
    );
  }, [study.answers]);

  // Handle changes in option selection
  const handleOptionChange = (option: string) => {
    if (study.options?.type === 'single') {
      setSelectedOptions([option]);
    } else {
      setSelectedOptions((prevOptions) =>
        prevOptions.includes(option)
          ? prevOptions.filter((opt) => opt !== option)
          : [...prevOptions, option]
      );
    }
  };

  useEffect(() => {
    controls.start({
      rotateY: isFlipped ? 180 : 0,
      transition: { duration: 1 }
    });
  }, [isFlipped, controls]);

  useEffect(() => {
    if (studyState === 'question') {
      setIsFlipped(false);
    } else {
      if (study.options) {
        onNewResult && onNewResult(selectedOptions);
      } else {
        setIsFlipped(true);
      }
    }
  }, [studyState, onNewResult, study.options, selectedOptions]);

  const renderFlippableCard = () => {
    return (
      <ChakraBox height="75%" width="100%" padding="10px">
        <motion.div
          style={{
            height: `calc(${height} - 100px)`,
            width: 'full',
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: study?.options ? 'left' : 'center',
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
          animate={controls}
        >
          {/* Question */}
          <motion.div
            style={{
              backfaceVisibility: 'hidden',
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '6px',
              backgroundColor: '#EBEFFF',
              transform: 'rotateY(0deg)',
              zIndex: isFlipped ? 1 : -1
            }}
          >
            <Text
              color="#212224"
              textAlign={'center'}
              fontSize="14px"
              fontFamily="Inter"
              padding="15px"
              width="100%"
              fontWeight="500"
              lineHeight="22px"
            >
              {study.questions}
            </Text>
            {study.options && (
              <VStack align="start" pb="10px" spacing={1} width="100%">
                {study.options?.content.map((option, index) => {
                  const isCorrect =
                    typeof study.answers === 'string'
                      ? study.answers === option
                      : study.answers.includes(option);
                  const isSelected = selectedOptions.includes(option);

                  // Set the styles based on the answer and selection state
                  let optionStyles = {};
                  if (studyState === 'answer') {
                    if (isCorrect) {
                      optionStyles = {
                        backgroundColor: '#4CAF50',
                        color: '#000'
                      };
                    } else if (isSelected) {
                      optionStyles = {
                        backgroundColor: '#F53535',
                        color: '#000'
                      };
                    }
                  }

                  return study.options?.type === 'single' ? (
                    <ChakraBox
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '6px 15px',
                        ...optionStyles
                      }}
                      key={index}
                    >
                      <Radio
                        isChecked={isSelected}
                        border="1.3px solid #D6D8E0"
                        background={'#fff'}
                        onChange={() => handleOptionChange(option)}
                        colorScheme="purple"
                        width="100%"
                        key={index}
                      >
                        <Text color="#212224" fontSize="12px" lineHeight="19px">
                          {option}
                        </Text>
                      </Radio>
                    </ChakraBox>
                  ) : (
                    <ChakraBox
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '4px 15px',
                        ...optionStyles
                      }}
                      key={index}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => {
                          handleOptionChange(option);
                        }}
                      />
                      <Text
                        color="#212224"
                        fontSize="12px"
                        lineHeight="19px"
                        marginLeft="5px"
                      >
                        {option}
                      </Text>
                    </ChakraBox>
                  );
                })}
              </VStack>
            )}
          </motion.div>

          {/* Answer */}
          <motion.div
            style={{
              backfaceVisibility: 'hidden',
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '6px',
              padding: '15px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              transform: 'rotateY(180deg)',
              zIndex: isFlipped ? -1 : 1
            }}
          >
            <Text
              color="#212224"
              textAlign="center"
              fontSize="14px"
              fontFamily="Inter"
              padding="10px"
              fontWeight="500"
              lineHeight="22px"
            >
              {study.answers}
            </Text>
          </motion.div>
        </motion.div>
      </ChakraBox>
    );
  };

  const renderDefaultCard = () => {
    return (
      <ChakraBox height="75%" background={'#F9FAFB'}>
        {/* Question Section */}
        <ChakraBox
          background="white"
          padding="10px"
          height={study.options ? '100%' : '60%'}
          marginBottom="5px"
        >
          <Text
            color="#212224"
            textAlign="left"
            fontSize="14px"
            fontFamily="Inter"
            width="100%"
            padding="10px"
            fontWeight="500"
            lineHeight="22px"
          >
            {questionText}
          </Text>
          {study.options && (
            <VStack align="start" pb="10px" spacing={2} width="100%">
              {study.options?.content.map((option, index) => {
                const isCorrect =
                  typeof study.answers === 'string'
                    ? study.answers === option
                    : study.answers.includes(option);
                const isSelected = selectedOptions.includes(option);

                // Set the styles based on the answer and selection state
                let optionStyles = {};
                if (studyState === 'answer') {
                  if (isCorrect) {
                    optionStyles = {
                      backgroundColor: '#4CAF50',
                      color: '#000'
                    };
                  } else if (isSelected) {
                    optionStyles = {
                      backgroundColor: '#F53535',
                      color: '#000'
                    };
                  }
                }

                return study.options?.type === 'single' ? (
                  <ChakraBox
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      padding: '8px',
                      ...optionStyles
                    }}
                    key={index}
                  >
                    <Radio
                      isChecked={isSelected}
                      border="1.3px solid #D6D8E0"
                      background={'#fff'}
                      onChange={() => handleOptionChange(option)}
                      colorScheme="purple"
                      width="100%"
                      key={index}
                    >
                      <Text color="#212224" fontSize="12px" lineHeight="19px">
                        {option}
                      </Text>
                    </Radio>
                  </ChakraBox>
                ) : (
                  <ChakraBox
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      padding: '8px',
                      ...optionStyles
                    }}
                    key={index}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        handleOptionChange(option);
                      }}
                    />
                    <Text
                      color="#212224"
                      fontSize="12px"
                      lineHeight="19px"
                      marginLeft="5px"
                    >
                      {option}
                    </Text>
                  </ChakraBox>
                );
              })}
            </VStack>
          )}
        </ChakraBox>
        {!study.options && (
          <ChakraBox height={'50%'} padding="10px">
            {studyState === 'answer' && answerText}
          </ChakraBox>
        )}
      </ChakraBox>
    );
  };

  return (
    <ChakraBox
      position="absolute"
      top="0"
      borderRadius="5px"
      backgroundColor={cardStyle === 'default' ? '#F9FAFB' : '#fff'}
      boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
      height={height}
      overflow="hidden"
      left="50%"
      transform="translateX(-50%)"
      width={width}
      {...rest}
    >
      {cardStyle === 'flippable' ? renderFlippableCard() : renderDefaultCard()}

      {/* Steps */}
      <ChakraBox
        display={'flex'}
        position="relative"
        height="fit-content"
        width="100%"
        paddingX="20px"
        mt="10px"
      >
        <StepIndicator
          isFirstAttempt={study.isFirstAttempt}
          steps={[
            { title: 'Week 1' },
            { title: '1 month' },
            { title: '3 months' },
            { title: 'Long term' }
          ]}
          activeStep={study.currentStep - 1}
        />
      </ChakraBox>
    </ChakraBox>
  );
};

export default FlashCard;
