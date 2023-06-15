import { Box, Button, FormControl, FormLabel, HStack, Input } from "@chakra-ui/react";
import { format } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { TutorQualification } from "../../../../types";
import onboardTutorStore from "../../../../state/onboardTutorStore";
import { motion, AnimatePresence } from "framer-motion";
import { RiPencilLine } from "react-icons/ri";

const QualificationsForm: React.FC = () => {
  const { qualifications: storeQualifications } = onboardTutorStore.useStore();
  const [formData, setFormData] = useState<TutorQualification>({
    institution: "",
    degree: "",
    startDate: null as unknown as Date,
    endDate: null as unknown as Date,
  });
  const [addQualificationClicked, setAddQualificationClicked] = useState(false);

  useEffect(() => {
    if (storeQualifications && storeQualifications.length === 1 && !addQualificationClicked) {
      setFormData(storeQualifications[0]);
    }
  }, [storeQualifications, addQualificationClicked]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updatedFormData);
    if (!addQualificationClicked) {
      onboardTutorStore.set.qualifications?.([updatedFormData]);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: new Date(e.target.value),
    };
    setFormData(updatedFormData);
    if (!addQualificationClicked) {

      onboardTutorStore.set.qualifications?.([updatedFormData]);
    }
  };

  const isFormValid = useMemo(() => {
    return Object.values(formData).every(Boolean);
  }, [formData])

  const handleAddQualification = () => {
    console.log(formData)
    const isFormValid = Object.values(formData).every(Boolean);
    console.log(isFormValid)
    if (!isFormValid) return;
    onboardTutorStore.set.qualifications?.([...(storeQualifications || []), formData]);
    setFormData({
      institution: "",
      degree: "",
      startDate: null as unknown as Date,
      endDate: null as unknown as Date,
    });
    setAddQualificationClicked(true);
  };

  const handleEditQualification = (id: string) => {
    if (!storeQualifications) return
    const selectedQualificationIndex = storeQualifications.findIndex(qual => (
      `${qual.institution}${qual.degree}${qual.startDate?.getTime()}${qual.endDate?.getTime()}` === id
    ));
    if (selectedQualificationIndex === -1) return;
    const selectedQualification = storeQualifications[selectedQualificationIndex];
    setFormData(selectedQualification);
    const updatedQualifications = storeQualifications.filter(qual => (
      `${qual.institution}${qual.degree}${qual.startDate?.getTime()}${qual.endDate?.getTime()}` !== id
    ));
    onboardTutorStore.set.qualifications?.(updatedQualifications);
  };
  
  const renderQualifications = () => {
    if (!addQualificationClicked || !storeQualifications) return null;

    const uniqueQualifications = storeQualifications.filter((qualification, index, self) =>
    index === self.findIndex((qual) => (
      `${qual.institution}${qual.degree}${qual.startDate?.getTime()}${qual.endDate?.getTime()}` === 
      `${qualification.institution}${qualification.degree}${qualification.startDate?.getTime()}${qualification.endDate?.getTime()}`
    ))
  );
    
    return uniqueQualifications.map((qualification) => {
      const startDate = new Date(qualification.startDate as Date);
      const endDate = new Date(qualification.endDate as Date);
      const formattedStartDate = startDate.getFullYear();
      const formattedEndDate = endDate.getFullYear();
      const id = `${qualification.institution}${qualification.degree}${startDate.getTime()}${endDate.getTime()}`;
  
      return (
        <Box
          key={id}
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
              onClick={() => handleEditQualification(id)}
              borderRadius="50%"
              p="5px"
              backgroundColor="transparent"
            >
              <RiPencilLine size={14} />
            </Button>
          </HStack>
        </Box>
      );
    });
  };
  
  console.log("is diabled", !isFormValid)

  return (
    <Box>
      <AnimatePresence>
        {storeQualifications && storeQualifications.length > 0 && (
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
      <FormControl id="institution" marginBottom="20px">
        <FormLabel>Institution</FormLabel>
        <Input placeholder="e.g Harvard University" name="institution" value={formData.institution} onChange={handleInputChange} />
      </FormControl>

      <FormControl id="degree" marginBottom="20px">
        <FormLabel>Degree</FormLabel>
        <Input placeholder="e.g Mathematics" name="degree" value={formData.degree} onChange={handleInputChange} />
      </FormControl>

      <HStack spacing={5} marginBottom="20px">
        <FormControl id="startDate">
          <FormLabel>Start date</FormLabel>
          <Input
            name="startDate"
            type="date"
            placeholder="Select Start Date"
            value={formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : ""}
            onChange={handleDateChange}
          />
        </FormControl>

        <FormControl id="endDate">
          <FormLabel>End date</FormLabel>
          <Input
            name="endDate"
            type="date"
            placeholder="Select End Date"
            value={formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : ""}
            onChange={handleDateChange}
          />
        </FormControl>
      </HStack>

      <Button margin={0}
        padding={0}
        color={"#207DF7"}
        fontSize={"sm"}
        marginTop="-20px"
        background={"transparent"}
        variant="ghost"
        colorScheme="white"
        isDisabled={!isFormValid}
        onClick={handleAddQualification}>
       + Add to qualifications
      </Button>

    </Box>
  );
};

export default QualificationsForm;
