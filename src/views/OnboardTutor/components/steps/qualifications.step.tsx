import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
} from "@chakra-ui/react";
import { useMemo, useEffect } from "react";
import onboardTutorStore from "../../../../state/onboardTutorStore";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RiCloseCircleLine, RiPencilLine } from "react-icons/ri";

interface Qualification {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

const QualificationsForm: React.FC = () => {
  // const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const { qualifications } = onboardTutorStore.useStore()
  const [formData, setFormData] = useState<Qualification>({
    institution: "",
    degree: "",
    startDate: "",
    endDate: "",
  });

  const isFormValid = useMemo(() => {
    return (
      Object.values(formData).filter((value) => !value || value.length < 1)
        .length < 1
    );
  }, [formData]);

  console.log(isFormValid);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddQualification = () => {
    if (!isFormValid) return;
    onboardTutorStore.set.qualifications([...qualifications, formData])
    setFormData({
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleEditQualification = (index: number) => {
    const selectedQualification = qualifications[index];
    setFormData(selectedQualification);
    const updatedQualifications = [...qualifications];
    updatedQualifications.splice(index, 1);
    onboardTutorStore.set.qualifications(updatedQualifications)
  };

  // const handleRemoveQualification = (index: number) => {
  //   setQualifications((prevQualifications) => {
  //     const updatedQualifications = [...prevQualifications];
  //     updatedQualifications.splice(index, 1);
  //     return updatedQualifications;
  //   });
  // };

  const renderQualifications = () => {
    return qualifications.map((qualification, index) => {
      const startDate = new Date(qualification.startDate);
      const endDate = new Date(qualification.endDate);

      const formattedStartDate = startDate.getFullYear();
      const formattedEndDate = endDate.getFullYear();

      return (
        <Box
          key={index}
          background="#FFFFFF"
          border="1px solid #EFEFF1"
          boxShadow="0px 3px 10px rgba(136, 139, 143, 0.09)"
          borderRadius="6px"
          padding="5px 15px"
          marginBottom="20px"
          position="relative"
        >
          <HStack justifyContent="space-between">
            <HStack>
              <Box fontWeight="bold">
                {qualification.institution},{" "}
                {`${formattedStartDate}-${formattedEndDate}`}
              </Box>
            </HStack>

            <Button
              border="1px solid #ECEDEE"
              color="#212224"
              onClick={() => handleEditQualification(index)}
              borderRadius="50%"
              p="5px"
              backgroundColor="transparent"
            >
              <RiPencilLine size={14} />
            </Button>
          </HStack>
        </Box>
      )
    });
  };

  return (
    <Box marginTop={30}>
      <AnimatePresence>
        {qualifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderQualifications()}
          </motion.div>
        )}
      </AnimatePresence>

      <FormControl marginTop={"20px"}>
        <FormLabel>Institution</FormLabel>
        <Input
          bg="#FFFFFF"
          border="1px solid #E4E5E7"
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
          type="text"
          name="institution"
          value={formData.institution}
          onChange={handleInputChange}
          placeholder="e.g. Harvard University"
        />
      </FormControl>
      <FormControl marginTop={"20px"}>
        <FormLabel>Degree</FormLabel>
        <Input
          bg="#FFFFFF"
          border="1px solid #E4E5E7"
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
          type="text"
          name="degree"
          value={formData.degree}
          onChange={handleInputChange}
          placeholder="e.g. Bachelor of Science"
        />
      </FormControl>
      <HStack marginTop={"20px"} spacing={4}>
        <FormControl>
          <FormLabel>Start Date</FormLabel>
          <Input
            bg="#FFFFFF"
            border="1px solid #E4E5E7"
            placeholder="e.g Jan, 2020"
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
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>End Date</FormLabel>
          <Input
            bg="#FFFFFF"
            border="1px solid #E4E5E7"
            placeholder="e.g Jan, 2020"
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
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
          />
        </FormControl>
      </HStack>
      <Button
        margin={0}
        padding={0}
        color={"#207DF7"}
        fontSize={"sm"}
        background={"transparent"}
        variant="ghost"
        colorScheme="white"
        onClick={handleAddQualification}
        isDisabled={!isFormValid}
      >
        + Additional qualifications
      </Button>
    </Box>
  );
};

export default QualificationsForm;
