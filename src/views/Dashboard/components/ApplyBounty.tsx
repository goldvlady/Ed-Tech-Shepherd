import CustomButton2 from '../../../components/CustomComponents/CustomButton';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import CustomToast from '../../../components/CustomComponents/CustomToast';
import ApiService from '../../../services/ApiService';
import resourceStore from '../../../state/resourceStore';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Radio,
  RadioGroup,
  useToast
} from '@chakra-ui/react';
import React, { useCallback, useState, useMemo } from 'react';
import { FiChevronDown } from 'react-icons/fi';

function ApplyBounty(props) {
  const { isApplyBountyOpen, closeApplyBounty, id } = props;
  const { courses: courseList, levels: levelOptions } = resourceStore();
  console.log(id, 'Bounty id');
  const toast = useToast();
  const handleSubmitBounty = async () => {
    const obj = { bountyId: id, message: `${id}` };
    const response = await ApiService.applyForBounty(obj);
    closeApplyBounty();
    if (response.status === 200) {
      toast({
        render: () => (
          <CustomToast
            title="Your Interest in this offer has been registered Successfully"
            status="success"
          />
        ),
        position: 'top-right',
        isClosable: true
      });
    } else {
      toast({
        render: () => (
          <CustomToast title="Something went wrong.." status="error" />
        ),
        position: 'top-right',
        isClosable: true
      });
    }
  };

  return (
    <>
      <CustomModal
        isOpen={isApplyBountyOpen}
        modalTitle="Apply For Bounty"
        isModalCloseButton
        style={{
          maxWidth: '400px',
          height: 'auto'
        }}
        footerContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <CustomButton2
              type="button"
              isCancel
              onClick={closeApplyBounty}
              title="Cancel"
            />
            <CustomButton2
              type="button"
              onClick={handleSubmitBounty}
              // active={isDisabledBtn}
              title="Apply"
              // disabled={!isDisabledBtn}
            />
          </div>
        }
        onClose={closeApplyBounty}
      >
        <Box bg="white" width="100%" mt="30px" padding="0 28px">
          Message
        </Box>
      </CustomModal>
    </>
  );
}

export default ApplyBounty;
