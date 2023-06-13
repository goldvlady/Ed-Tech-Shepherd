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
import onboardTutorStore from "../../../../state/onboardTutorStore";

interface PaymentFormData {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

const PaymentInformationForm: React.FC = () => {
  const {paymentInfo} = onboardTutorStore.useStore()
  const [formData, setFormData] = useState<PaymentFormData>({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });

  const setPaymentInformation = (
    f: (v:  PaymentFormData) =>  PaymentFormData |  PaymentFormData
  ) => {
    if (typeof f === "function") {
      onboardTutorStore.set.paymentInfo(f(paymentInfo));
    } else {
      onboardTutorStore.set.availability(f);
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
            value={paymentInfo.accountName}
            onChange={handleInputChange}
            placeholder="e.g Leslie Peters"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Account Number</FormLabel>
          <Input
            type="text"
            name="accountNumber"
            value={paymentInfo.accountNumber}
            onChange={handleInputChange}
            placeholder="0000000000"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Bank</FormLabel>
          <Input
            type="text"
            name="bankName"
            value={paymentInfo.bankName}
            onChange={handleInputChange}
            placeholder="e.g Barclays"
          />
        </FormControl>
      </Stack>
    </Box>
  );
};

export default PaymentInformationForm;
