import { Text } from '@chakra-ui/react';
import styled from 'styled-components';

export const Form = styled.form<{ isHomeWorkHelp?: boolean }>`
  grid-column: span 6;
  flex: auto;
  height: 100%;
  position: ${({ isHomeWorkHelp }) => (isHomeWorkHelp ? 'none' : 'fixed')};
  width: ${({ isHomeWorkHelp }) => (isHomeWorkHelp ? '100%' : '40.7%')};
  right: 0;
  border-left: 1px solid #eeeff2;
  background: white;

  @media only screen and (max-width: 768px) {
    width: ${({ isHomeWorkHelp }) => (isHomeWorkHelp ? '100%' : '100%')};
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  // height: 100%;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  flex-shrink: 0;
  background-color: white;
`;

export const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  position: fixed;
  // bottom: 148px;
  height: 37em;
`;

export const ChatContainer = styled.div`
  grid-column: 1 / span 13;
  margin: 6px;
  padding: 3px;
  height: 52px;
  border-radius: 0.375rem;
  background-color: #f8fafc;
  color: #6b7280;
  font-weight: lighter;
  align-content: center;
`;

export const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-x: auto;
  margin-bottom: 1rem;
`;

export const GridContainer = styled.div<{ isHomeWorkHelp?: boolean }>`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 0.5rem;
  // position: fixed;
  top: 300px;
  height: 100%;
  width: ${({ isHomeWorkHelp }) => (isHomeWorkHelp ? '100%' : '100%')};
  width: -moz-available;
  max-height: 45vh;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const GridItem = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-column-start: 1;
  grid-column-end: 13;
  margin: 1.5rem;
  padding: 0.75rem;
  height: auto;
  border-radius: 0.375rem;
  background-color: #f7f7f7;
  color: #1f2937;
  font-weight: lighter;
  place-content: center;
  z-index: 9999;

  @media only screen and (max-width: 768px) {
    margin: 0.5rem;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: middle;
  grid-column-start: 1;
  grid-column-end: 13;
  padding-bottom: 0.5rem;
  grid-row-span: 2;
  width: 100%;
`;

export const CircleContainer = styled.div`
  height: 5rem;
  width: 4.5rem;
  flex-shrink: 0;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

export const TextContainer = styled.div`
  padding-left: 1.25rem;
  padding-top: 0.75rem;
`;

export const StyledText = styled(Text)`
  padding-top: 0.5rem;
  grid-column-start: 1;
  grid-column-end: 13;
  font-size: 0.875rem;
  font-weight: 600;

  @media only screen and (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: span 12;
  padding: 0.875rem 0.375rem;
  height: 6rem;
  border-radius: 0.375rem;
  justify-content: space-between;
  margin-left: 1.75rem;
  font-size: 0.875rem;

  @media only screen and (max-width: 768px) {
    margin-left: 0;
    padding: 10px 10px;
    gap: 15px;
  }
`;

export const PillsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  @media only screen and (max-width: 768px) {
    display: flex;
    flex-wrap: wrap;
  }
`;

export const StyledDiv = styled.div<{
  needIndex?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: ${({ needIndex }) =>
    !needIndex ? '1px solid #cbd5e0' : '1px solid #FB8441'};
  border-radius: 9999px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  gap: 6px;

  &:hover {
    background-color: #eaebeb;
  }
  > p {
    margin-left: 10px;
  }

  @media only screen and (max-width: 768px) {
    margin-bottom: 15px;
  }
`;

export const ChatbotContainer = styled.div<{
  chatbotSpace: number;
}>`
  width: inherit;
  // position: fixed;
  z-index: 50;
  // background: #f9f9fb;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: auto;
  // padding: 1rem;
  gap: 10px;
  border-left: 1px solid #eeeff2;
`;

export const InputContainer = styled.div`
  // flex-grow: 1;
  // position: relative;
  // width: 100%;
  position: fixed;
  width: -webkit-fill-available;
  width: intrinsic; /* Safari/WebKit uses a non-standard name */
  width: -moz-max-content; /* Firefox/Gecko */
  width: -moz-available;
  bottom: 0;
  background: rgb(249, 249, 251);
  padding: 10px;
`;

export const Input = styled.textarea`
  width: 100%;
  background: #fff;
  border: 0.8px solid #cdd1d5;
  border-radius: 100px;
  outline: none;
  padding-left: 1rem;
  padding-right: 3rem;
  font-size: 0.75rem;
  resize: none;
  min-height: 2.5rem;

  &::placeholder {
    font-size: 0.75rem;
  }

  @media only screen and (max-width: 768px) {
    width: 85%;
  }
`;

export const SendButton = styled.button`
  position: absolute;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
  width: 2.75rem;
  right: 10px;
  top: -20px;
  color: #cbd5e0;
  &:hover {
    color: #4a5568;
  }

  @media only screen and (max-width: 768px) {
    width: 9.45rem;
    right: 15px;
    top: -17px;
  }
`;

export const ClockButton = styled.button`
  // display: flex;
  align-items: center;
  justify-content: center;
  background-color: #cbd5e0;
  &:hover {
    background-color: #a0aec0;
  }
  border-radius: 0.375rem;
  color: #ffffff;
  padding: 0.5rem 1rem;
  flex-shrink: 0;
  position: absolute;
  bottom: 94px;
  right: 12px;
  display:none
  // bottom: -731px;
  // right: 6px

  @media only screen and (max-width: 768px) {
    display: block;
  }
`;

export const SummaryContainer = styled.div`
  border-radius: 8px;
  background: #f4f5f6;
  color: #585f68;
  font-size: 0.875rem;
  line-height: 2;
  margin: 20px 0 40px 0;
  position: relative;
  cursor: pointer;
`;

export const DefaultSummaryContainer = styled.div`
  border-radius: 8px;
  background: #f4f5f6;
  color: #585f68;
  font-size: 0.875rem;
  line-height: 2;
  margin: 20px 0;
  position: relative;
  cursor: pointer;
  width: -webkit-fill-available;
  height: 70vh;
  border: none;
  overflow-y: scroll;
`;

export const SummaryContainer2 = styled.textarea`
  border-radius: 8px;
  background: #f4f5f6;
  color: #585f68;
  font-size: 0.875rem;
  line-height: 2;
  margin: 20px 0;
  position: relative;
  cursor: pointer;
  resize: none;
  width: -webkit-fill-available;
  height: 72vh;
  border: none;
`;

export const PageCount = styled.div`
  font-size: 0.75rem;
  color: #6e7682;
  display: flex;
  align-items: center;
  margin-top: 25px;

  > svg {
    cursor: pointer;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: end;
  position: absolute;
  right: 17px;
  top: 54px;

  > svg {
    cursor: pointer;
  }
`;

export const NeedPills = styled.img`
  height: 18px;
  width: 18px;
  color: gray;
`;

export const StyledCheckbox = styled(Input)`
  width: 15px;
  height: 15px;
  border-radius: 4px;
  margin-right: 6px;
  cursor: pointer;
`;

export const RadioInput = styled.input`
  transform: scale(1.3);
  cursor: pointer;
  height: 14px;
  width: 14px;
`;

export const ChatContainerResponse = styled.div<{ messages: any }>`
  display: flex;
  flex-direction: column;
  grid-column: span 12;
  margin-top: 8px;
  margin-right: 24px;
  margin-bottom: 20px;
  margin-left: 24px;
  height: auto;
  width: 80%;
  // position: absolute;
  right: 0;
  bottom: 236px;
  // height: 400px; /* Specific height as a fallback */
  // height: -webkit-fill-available; /* For Safari */
  width: 100%; /* fallback for browsers not supporting -webkit-fill-available */
  width: -webkit-fill-available;
  width: -moz-available;
  z-index: ${({ messages }) => (messages ? '10' : '-1')};
  width: -moz-available;
  /* Scrollable content */
  // overflow-y: scroll;
  // scrollbar-width: thin;
  // scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  z-index: 1;
  // padding-bottom: 440px;

  /* Custom styling for the scrollbar - for Webkit browsers */
  ::-webkit-scrollbar {
    width: 0px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  @media only screen and (max-width: 768px) {
    margin-top: 8px;
    margin-bottom: 96px;
    margin-left: 17px;
    margin-right: 17px;
  }
`;

export const UserMessage = styled.div`
  align-self: flex-end;
  background: #207df7;
  color: #333;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  color: #fff;
  font-size: 0.875rem;
  border-radius: 10px;
  min-width: auto;
  max-width: 439px;

  @media only screen and (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

export const AiMessage = styled.div`
  align-self: flex-start;
  background: #f7f7f7;
  color: #333;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 0.875rem;
  border-radius: 10px;
  max-width: 439px;
  min-width: auto;

  @media only screen and (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

export const StyledPromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: span-full;
  padding: 3px;
  padding-bottom: 1px;
  height: 36px;
  border-radius: 8px;
  justify-content: space-between;
  margin-left: 7px;
  font-size: 0.875rem;
`;

export const StyledPromptText = styled.p`
  margin-top: 1rem;
`;

export const StyledPrompt = styled.div`
  border: 1px solid #ccc;
  border-radius: 9999px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  margin-right: 0.825rem;
  cursor: pointer;

  &:hover {
    background-color: #eee;
  }
`;

export const ChatHistoryDate = styled.div`
  width: 170px;
  border: 1px solid #f0f1f4;
  box-shadow: 0px 3px 5px 0px #757e8a0f;
  color: #6e7682;
  background: #ffffff;
  font-size: 0.75rem;
  border-radius: 8px;
  padding: 10px;
  margin: 0 auto;
  text-align: center;
`;

export const ChatHistoryBody = styled.div`
  background: #f4f5f6;
  display: grid;
  gap: 6px;
  font-size: 0.875rem;
  color: #585f68;
  padding: 8px;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.3s ease; /* Smooth transition over 0.3 seconds */
  // justify-content: space-between;
  grid-template-columns: 9% 66% 20% 8%;
  align-items: center;

  &:hover {
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    border-color: #007bff;
    cursor: pointer;
  }
`;

export const ChatHistoryContainer = styled.div`
  margin: 78px 0;
  width: 100%;
`;

export const ChatHistoryBlock = styled.div`
  margin-top: 25px;
  padding: 10px;
`;

export const ChatHistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eeeff2;
  margin-bottom: 15px;
  position: fixed;
  height: 7vh;
  width: 26%;
  top: 78px;
  background: white;
  // z-index: 999;

  p:nth-child(1) {
    font-size: 1.125rem;
    color: #585f68;
    font-weight: 500;
  }

  p:nth-child(2) {
    font-size: 0.75rem;
    color: #f53535;
    font-weight: 500;
    cursor: pointer;
  }

  @media only screen and (max-width: 768px) {
    width: 86%;
  }
`;

export const AskSomethingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-column: 1 / -1;
  padding: 0.25rem 0.3rem;
  height: 9rem;
  border-radius: 8px;
  margin-left: 1.75rem;
  font-size: 0.875rem;

  @media only screen and (max-width: 768px) {
    margin-left: 0.75rem;
  }
`;

export const AskSomethingPill = styled.div`
  border: 1px solid #eaebeb;
  border-radius: 9999px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0 0.25rem 0.5rem 0.25rem;

  :hover {
    background: #eaebeb;
    cursor: pointer;
  }
`;

export const AskSomethingPillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const AskSomethingPillHeadingText = styled(Text)`
  margin: 1rem 0;
`;

export const TellMeMorePill = styled.div<{ isHomeWorkHelp?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: ${({ isHomeWorkHelp }) => (!isHomeWorkHelp ? '252px' : '185px')};
  border: 1px solid #eaebeb;
  background: #fff;
  border-radius: 9999px;
  width: 97%;
  padding: 8px;
  margin: 0 10px;

  :hover {
    background: #eaebeb;
    cursor: pointer;
  }

  p {
    font-size: 0.8125rem;
    color: #3b3f45;
  }
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  text-align: -webkit-center;
  flex-direction: column;
  align-items: center;
  margin: 200px 0;
  text-align: -moz-center;
  text-align: center;

  p {
    margin-top: 20px;
    margin-bottom: 30px;
    color: #585f68;
  }
`;

export const StudyContainer = styled.section`
  margin: 50px 0;
`;

export const StudyFirstLayer = styled.div`
  text-align: center;

  > p:nth-child {
  }
`;

export const DownPillContainer = styled.div`
  position: fixed;
  width: 100%;
  display: flex;
  flex-direction: column;
  grid-column: span 12 / auto;
  padding: 0.75rem 0.375rem;
  height: 6rem;
  border-radius: 0.375rem;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding-left: 0.825rem;
  font-size: 0.875rem;
  bottom: 55px;
  width: 100%;
  background: white;

  @media only screen and (max-width: 768px) {
    height: auto;
    padding-left: 0.75rem;
    bottom: 56px;
  }
`;

export const HomeWorkHelpChatContainer2 = styled.textarea`
  border-radius: 8px;
  background: #f4f5f6;
  color: #585f68;
  font-size: 0.875rem;
  position: relative;
  cursor: pointer;
  resize: none;
  width: -webkit-fill-available;
  height: 10vh;
  border: none;
`;

export const TempPDF = styled.div`
  display: block @media only screen and (max-width: 768px) {
    display: none;
  }
`;
