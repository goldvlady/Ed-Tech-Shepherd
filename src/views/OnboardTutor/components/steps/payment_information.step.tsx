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
import {TutorBankInfo} from "../../../../types"
import onboardTutorStore from "../../../../state/onboardTutorStore";

type PaymentFormData = TutorBankInfo

const PaymentInformationForm: React.FC = () => {
  const {bankInfo} = onboardTutorStore.useStore()
  const [formData, setFormData] = useState<PaymentFormData>({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });

  const setPaymentInformation = (
    f: (v:  PaymentFormData) =>  PaymentFormData |  PaymentFormData
  ) => {
    if(typeof f !== "function" || !bankInfo ){
      onboardTutorStore.set.bankInfo?.(f as unknown as PaymentFormData);
    }
    else{
      onboardTutorStore.set.bankInfo?.(f(bankInfo as PaymentFormData));
    } 
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setPaymentInformation((prevFormData) => ({
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
            value={bankInfo?.accountName}
            onChange={handleInputChange}
            placeholder="e.g Leslie Peters"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Account Number</FormLabel>
          <Input
            type="number"
            name="accountNumber"
            value={bankInfo?.accountNumber}
            onChange={handleInputChange}
            placeholder="0000000000"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bank</FormLabel>
          <Input
            type="text"
            name="bankName"
            value={bankInfo?.bankName}
            onChange={handleInputChange}
            placeholder="e.g Barclays"
          />
        </FormControl>
      </Stack>
    </Box>
  );
};

export default PaymentInformationForm;
