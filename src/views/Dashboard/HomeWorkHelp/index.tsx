import CustomModal from '../../../components/CustomComponents/CustomModal';
import Chat from '../DocChat/chat';
import ChatHistory from '../DocChat/chatHistory';
import ViewTutors from './ViewTutors';
import {
  HomeWorkHelpChatContainer,
  HomeWorkHelpContainer,
  HomeWorkHelpHistoryContainer
} from './style';
import React, { useState, useCallback } from 'react';

const HomeWorkHelp = () => {
  const [isOpenModal, setOpenModal] = useState(false);

  const onOpenModal = useCallback(() => {
    setOpenModal((prevState) => !prevState);
  }, []);

  return (
    <HomeWorkHelpContainer>
      <HomeWorkHelpHistoryContainer>
        <ChatHistory />
      </HomeWorkHelpHistoryContainer>
      <HomeWorkHelpChatContainer>
        <Chat HomeWorkHelp onOpenModal={onOpenModal} />
      </HomeWorkHelpChatContainer>

      <CustomModal
        isOpen={isOpenModal}
        onClose={onOpenModal}
        modalSize="lg"
        style={{
          height: '100Vh',
          maxWidth: '100%'
        }}
      >
        <ViewTutors onOpenModal={onOpenModal} />
      </CustomModal>
    </HomeWorkHelpContainer>
  );
};

export default HomeWorkHelp;
