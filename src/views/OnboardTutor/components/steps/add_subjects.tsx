import { useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import onboardTutorStore from "../../../../state/onboardTutorStore";
import { useState, useCallback } from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { Course } from "../../../../types";

interface SubjectLevel {
  subject: string;
  level: string;
}



const SubjectLevelForm: React.FC = () => {
  const {subjectLevel: subjectLevels} = onboardTutorStore.useStore();

  type SubjectLevel= typeof subjectLevels

  const setSubjectLevels = (f: (d: typeof subjectLevels) => SubjectLevel) => {
    onboardTutorStore.set.subjectLevel(f(subjectLevels))
  }
  
  const [courseList, setCourseList] = useState<Course[]>([]);

  const [loadingCourses, setLoadingCourses] = useState(false);


  const handleSubjectChange = (index: number, value: string) => {
    setSubjectLevels((prevSubjectLevels) => {
      const updatedSubjectLevels = [...prevSubjectLevels];
      updatedSubjectLevels[index].subject = value;
      return updatedSubjectLevels;
    });
  };

  const handleLevelChange = (index: number, value: string) => {
    setSubjectLevels((prevSubjectLevels) => {
      const updatedSubjectLevels = [...prevSubjectLevels];
      updatedSubjectLevels[index].level = value;
      return updatedSubjectLevels;
    });
  };

  const addSubject = () => {
    setSubjectLevels((prevSubjectLevels) => [
      ...prevSubjectLevels,
      { subject: "", level: "" },
    ]);
  };

  const removeSubject = (index: number) => {
    setSubjectLevels((prevSubjectLevels) => {
      const updatedSubjectLevels = [...prevSubjectLevels];
      updatedSubjectLevels.splice(index, 1);
      return updatedSubjectLevels;
    });
  };

  const variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box marginTop={30}>
      <AnimatePresence>
        {subjectLevels.map((subjectLevel, index) => (
          <motion.div
            key={index}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ marginBottom: "20px" }}
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
                <Select
                  value={subjectLevel.subject}
                  onChange={(e) => handleSubjectChange(index, e.target.value)}
                  bg="#FFFFFF"
                  border="1px solid #E4E5E7"
                  boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                  borderRadius="6px"
                  placeholder="Select subject "
                  
                  _placeholder={{
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: "20px",
                    letterSpacing: "-0.003em",
                    color: "#9A9DA2",
                  }}
                >
                  <option value="subject1">Subject 1</option>
                  <option value="subject2">Subject 2</option>
                  <option value="subject3">Subject 3</option>
                </Select>
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
                <Select
                  value={subjectLevel.level}
                  onChange={(e) => handleLevelChange(index, e.target.value)}
                  bg="#FFFFFF"
                  border="1px solid #E4E5E7"
                  placeholder="Select level"
                  boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                  borderRadius="6px"
                  _placeholder={{
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: "20px",
                    letterSpacing: "-0.003em",
                    color: "#9A9DA2",
                  }}
                >
                  <option value="level1">Level 1</option>
                  <option value="level2">Level 2</option>
                  <option value="level3">Level 3</option>
                </Select>
              </FormControl>
              {subjectLevels.length > 1 && (
                <RiCloseCircleLine
                  style={{ marginTop: "20px" }}
                  cursor={"pointer"}
                  onClick={() => removeSubject(index)}
                  size={50}
                  color="#F53535"
                />
              )}
            </HStack>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button
        margin={0}
        padding={0}
        color={"#207DF7"}
        fontSize={"sm"}
        marginTop={"-20px"}
        background={"transparent"}
        variant="ghost"
        colorScheme="white"
        onClick={addSubject}
      >
        + Add Additional Subject
      </Button>
    </Box>
  );
};

export default SubjectLevelForm;
