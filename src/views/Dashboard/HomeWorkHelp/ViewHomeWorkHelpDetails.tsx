import CustomButton from '../../../components/CustomComponents/CustomButton/index';
import CustomModal from '../../../components/CustomComponents/CustomModal';
import { Box, FormControl, FormLabel, HStack, Input } from '@chakra-ui/react';
import React, { ChangeEvent, useCallback, useState, useMemo } from 'react';
import { Button } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

const ViewHomeWorkHelpDetails = ({
  openAceHomework,
  handleClose,
  handleAceHomeWorkHelp
}: {
  openAceHomework: boolean;
  handleClose: () => void;
  handleAceHomeWorkHelp: () => void;
}) => {
  const [localData, setLocalData] = useState<{
    subject: string;
    topic: string;
    deckName: string;
  }>({
    subject: '',
    topic: '',
    deckName: ''
  });
  const navigate = useNavigate();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLocalData((prevState: any) => ({
        ...prevState,
        [name]: value
      }));
    },
    [setLocalData]
  );

  const isDisabledBtn = useMemo(() => {
    return !Object.values(localData).some((value) => value === '');
  }, [localData]);

  const onRouteHomeWorkHelp = useCallback(() => {
    handleClose();
    handleAceHomeWorkHelp();
    navigate('/dashboard/ace-homework', {
      state: localData
    });
  }, [localData]);

  return (
    <CustomModal
      isOpen={openAceHomework}
      modalTitle="Provide more details"
      isModalCloseButton
      style={{
        maxWidth: '400px',
        height: 'auto'
      }}
      footerContent={
        <div style={{ display: 'flex', gap: '8px' }}>
          <CustomButton
            type="button"
            isCancel
            onClick={handleAceHomeWorkHelp}
            title="Cancel"
          />
          <CustomButton
            type="button"
            onClick={onRouteHomeWorkHelp}
            active={isDisabledBtn}
            title="Confirm"
            disabled={!isDisabledBtn}
          />
        </div>
      }
      onClose={handleAceHomeWorkHelp}
    >
      <Box bg="white" width="100%" mt="30px" padding="0 28px">
        <FormControl mb={6}>
          <FormLabel
            fontSize="0.75rem"
            lineHeight="17px"
            color="#5C5F64"
            mb={3}
          >
            Subject
          </FormLabel>
          <Input
            type="text"
            name="subject"
            placeholder="e.g. biology"
            value={localData.subject}
            onChange={handleChange}
            _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
          />
        </FormControl>
        <FormControl mb={6}>
          <FormLabel
            fontSize="0.75rem"
            lineHeight="17px"
            color="#5C5F64"
            mb={3}
          >
            Topic
          </FormLabel>
          <Input
            type="text"
            name="topic"
            placeholder="e.g genetics"
            value={localData.topic}
            onChange={handleChange}
            _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
          />
        </FormControl>
        <FormControl mb={6}>
          <FormLabel
            fontSize="0.75rem"
            lineHeight="17px"
            color="#5C5F64"
            mb={3}
          >
            Level
          </FormLabel>
          <Input
            type="text"
            name="deckName"
            placeholder="Level"
            value={localData.deckName}
            onChange={handleChange}
            _placeholder={{ fontSize: '0.8756rem', color: '#9A9DA2' }}
          />
        </FormControl>
      </Box>
    </CustomModal>
  );
};

export default ViewHomeWorkHelpDetails;
