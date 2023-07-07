import userStore from '../state/userStore';
import CustomModal from './CustomComponents/CustomModal';
import { StarIcon } from './icons';
import { SelectedNoteModal } from './index';
import { Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Typewriter from 'typewriter-effect';

const actions1 = [
  {
    id: 1,
    title: 'Test Prep',
    showModal: true,
    description:
      'Got a test coming? Shepherd has you covered with quizzes & prep resources priming you for the big day',
    imageURL: '/images/test.svg'
  },
  {
    id: 2,
    title: 'Deep Dives',
    showModal: true,
    description:
      'Struggling with a tricky topic? Let Shepherd simplify it for you with in-depth analysis & detailed explanations',
    imageURL: '/images/bulb.svg'
  },
  {
    id: 3,
    title: 'Notes Navigator',
    showModal: true,
    description:
      'Want to make the most of your notes? Chat with them via Shepherd and uncover insights to boost your grasp ',
    imageURL: '/images/notes-navigator.svg'
  },
  {
    id: 4,
    title: 'Research Assistant',
    showModal: true,
    description:
      'Delving into a research project? Let Shepherd find you the best resources & references for your work',
    imageURL: '/images/research-assistant.svg'
  },
  {
    id: 5,
    title: 'Ace Homework',
    showModal: true,
    description:
      'Stuck with your homework, Shepherd can guide you through it step by step for quick & easy completion',
    imageURL: '/images/ace-homework.svg'
  },
  {
    id: 6,
    title: 'Flashcards Factory',
    showModal: true,
    description:
      'Need a memory boost? Generate custom flashcards & mnemonics with Shepherd, making memorization a breeze',
    imageURL: '/images/flashcards.svg'
  },
  {
    id: 7,
    title: 'Study Roadmap',
    showModal: true,
    description:
      'Just starting school? Let Shepherd create a tailored study plan guiding you to academic success',
    imageURL: '/images/roadmap.svg'
  }
];

interface ToggleProps {
  setToggleHelpModal: (state: boolean) => void;
  toggleHelpModal: boolean;
}

const HelpModal = ({ setToggleHelpModal, toggleHelpModal }: ToggleProps) => {
  const [showSelected, setShowSelected] = useState(false);
  const { user }: any = userStore();

  const handleClose = () => {
    setToggleHelpModal(false);
  };

  const handleShowSelected = () => {
    setShowSelected(true);
    setToggleHelpModal(!toggleHelpModal);
  };

  const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 3px;
    padding-bottom: 2px;
  `;

  const Icon = styled(StarIcon)`
    color: #0000ff;
    height: 16px;
    width: 16px;
    margin-right: 15px;
  `;

  const CustomTypewriter = styled(Typewriter)`
    &.text-base {
      font-size: 1rem;
      font-weight: 600;
      color: #212224;
    }
  `;

  const DescriptionContainer = styled.div`
    overflow: hidden;
    padding: 6px;
    padding-bottom: 2px;
    background-color: white;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    align-items: center;
    padding 0 20px;
    margin-top: 20px;
  `;

  const CenteredRow = styled.div`
    display: flex;
    justify-content: center;
    padding: 0px 113px;
    gap: 14px;
    margin: 20px 30px;
  `;

  const ActionItem = styled.div`
    position: relative;
    cursor: pointer;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    transition: border-color 0.3s;
    height: 232px;

    &:hover {
      border-color: #0000ff;
    }
  `;

  const Image = styled.img`
    width: fit-content;
  `;

  const DescriptionWrapper = styled.div`
    margin-top: 16px;
  `;

  const Title = styled(Text)`
    position: relative;
    font-size: 1rem;
    font-weight: 600;
    color: #ff8800;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
    }
  `;

  const Description = styled.p`
    margin-top: 8px;
    font-size: 0.875rem;
    color: #777777;
  `;

  const ModalBody = styled.div`
    display: block;
  `;

  return (
    <>
      <CustomModal
        isOpen={toggleHelpModal}
        onClose={handleClose}
        isModalCloseButton
        modalSize="xl"
        modalTitleStyle={{
          borderBottom: '1px solid #EEEFF2'
        }}
        modalTitle={
          <Container>
            <Icon className="" onClick={undefined} />
            <CustomTypewriter
              options={{
                delay: 10,
                autoStart: true,
                loop: false,
                skipAddStyles: true
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString(
                    `Hi ${
                      user?.displayName || 'there'
                    }, How can Shepherd make your study time more effective today?`
                  )
                  .start();
              }}
            />
          </Container>
        }
        style={{ maxWidth: '984px', height: 'auto' }}
      >
        <ModalBody>
          <DescriptionContainer>
            {actions1.slice(0, 4).map((action) => (
              <ActionItem
                key={action.title}
                onClick={() => {
                  if (action.showModal) handleShowSelected();
                }}
              >
                <Image src={action.imageURL} alt={action.title} />
                <DescriptionWrapper>
                  <Title>{action.title}</Title>
                  <Description>{action.description}</Description>
                </DescriptionWrapper>
              </ActionItem>
            ))}
          </DescriptionContainer>
          <CenteredRow>
            {actions1.slice(4, 7).map((action) => (
              <ActionItem
                key={action.title}
                onClick={() => {
                  if (action.showModal) handleShowSelected();
                }}
              >
                <Image src={action.imageURL} alt={action.title} />
                <DescriptionWrapper>
                  <Title>{action.title}</Title>
                  <Description>{action.description}</Description>
                </DescriptionWrapper>
              </ActionItem>
            ))}
          </CenteredRow>
        </ModalBody>
      </CustomModal>
      {showSelected && (
        <SelectedNoteModal
          show={showSelected}
          setShow={setShowSelected}
          setShowHelp={setToggleHelpModal}
        />
      )}
    </>
  );
};

export default HelpModal;
