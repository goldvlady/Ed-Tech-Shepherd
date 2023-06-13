import React, { useState } from "react";
import {
  Box,
  Button,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";

interface PaymentFormData {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

const PaymentInformationForm: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <Box marginTop={30}>
      <Stack spacing={5}>
        <FormControl>
          <FormLabel>Account Name</FormLabel>
          <Input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleInputChange}
            placeholder="e.g Leslie Peters"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Account Number</FormLabel>
          <Input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            placeholder="0000000000"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Account Number</FormLabel>
          <Input
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            placeholder="0000000000"
          />
        </FormControl>
      </Stack>
    </Box>
  );
};

export default PaymentInformationForm;
