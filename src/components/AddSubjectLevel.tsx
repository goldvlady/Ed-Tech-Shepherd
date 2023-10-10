import resourceStore from '../state/resourceStore';
import CustomSelect from './CustomSelect';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { useEffect } from 'react';
import { useState, useCallback } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

function AddSubjectLevel(props) {
  const {
    subjectLevels,
    handleSubjectChange,
    handleLevelChange,
    removeSubject,
    addSubject
  } = props;
  const { courses: courseList, levels } = resourceStore();
  console.log(subjectLevels, 'null');

  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };
  return (
    <>
      {' '}
      <Box marginTop={30}>
        <AnimatePresence>
          {subjectLevels.map((subjectLevel, index) => (
            <motion.div
              key={index}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{ marginBottom: '20px' }}
            >
              <HStack spacing={4} alignItems="center">
                <FormControl>
                  <FormLabel
                    fontStyle="normal"
                    fontWeight={500}
                    fontSize={14}
                    lineHeight="20px"
                    letterSpacing="-0.001em"
                    color="#5C5F64"
                  >
                    Subject
                  </FormLabel>
                  <CustomSelect
                    value={subjectLevel.course.label}
                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                    placeholder="Select subject "
                  >
                    {' '}
                    {courseList.map((course) => (
                      <option value={course.label}>{course.label}</option>
                    ))}
                  </CustomSelect>
                </FormControl>
                <FormControl>
                  <FormLabel
                    fontStyle="normal"
                    fontWeight={500}
                    fontSize={14}
                    lineHeight="20px"
                    letterSpacing="-0.001em"
                    color="#5C5F64"
                  >
                    Level
                  </FormLabel>
                  <CustomSelect
                    value={subjectLevel.level?.label}
                    onChange={(e) => handleLevelChange(index, e.target.value)}
                    placeholder="Select Level "
                  >
                    {levels.map((level) => (
                      <option value={level.label}>{level.label}</option>
                    ))}
                  </CustomSelect>
                </FormControl>
                {subjectLevels.length > 1 && (
                  <RiCloseCircleLine
                    style={{ marginTop: '30px' }}
                    cursor={'pointer'}
                    onClick={() => removeSubject(index)}
                    size={50}
                    color="#9A9DA2"
                  />
                )}
              </HStack>
            </motion.div>
          ))}
        </AnimatePresence>
        <Button
          margin={0}
          padding={0}
          color={'#207DF7'}
          fontSize={'sm'}
          marginTop={'-20px'}
          background={'transparent'}
          variant="ghost"
          colorScheme="white"
          onClick={addSubject}
        >
          + Add Additional Subject
        </Button>
      </Box>
    </>
  );
}

export default AddSubjectLevel;
