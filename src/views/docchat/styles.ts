import { Text } from '@chakra-ui/react';
import styled from 'styled-components';

export const Form = styled.form`
  grid-column: span 6;
  flex: auto;
  height: 100%;
  position: fixed;
  width: 40.7%;
  ri: 0;
  right: 0;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  height: 100%;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  flex-shrink: 0;
  background-color: white;
  height: 100%;
  overflow: scroll;
`;

export const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 0.5rem;
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
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: middle;
  grid-column-start: 1;
  grid-column-end: 13;
  padding-bottom: 0.5rem;
  grid-row-span: 2;
`;

export const CircleContainer = styled.div`
  height: 4rem;
  width: 4rem;
  flex-shrink: 0;
  background-color: #ffad3b;
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
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: span 12;
  padding: 0.75rem 0.375rem;
  height: 6rem;
  border-radius: 0.375rem;
  justify-content: space-between;
  margin-left: 1.75rem;
  font-size: 0.875rem;
`;

export const PillsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #cbd5e0;
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
`;

export const ChatbotContainer = styled.div<{
  chatbotSpace: number;
}>`
  width: inherit;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  z-index: 50;
  border: 1px solid #cbd5e0;
  background-color: #f9fafb;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 89px;
  padding: 1rem;
  gap: 10px;
`;

export const InputContainer = styled.div`
  flex-grow: 1;
  position: relative;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  background: #fff;
  border: 0.8px solid #cdd1d5;
  border-radius: 100px;
  outline: none;
  padding-left: 1rem;
  height: 2.5rem;
  font-size: 0.75rem;

  &::placeholder {
    font-size: 0.75rem;
  }
`;

export const SendButton = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 2.75rem;
  right: 0;
  top: 0;
  color: #cbd5e0;
  &:hover {
    color: #4a5568; 
`;

export const ClockButton = styled.button`
  display: flex;
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
`;

export const SummaryContainer = styled.div`
  border-radius: 8px;
  background: #f4f5f6;
  color: #585f68;
  font-size: 0.875rem;
  padding: 12px;
  line-height: 2;
  margin: 18px 0;
  position: relative;
  cursor: pointer;
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
  top: 2px;

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

export const ChatContainerResponse = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: span 12;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 0 24px;
  max-height: 42vh;

  /* Scrollable content */
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  /* Custom styling for the scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
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
`;

export const AiMessage = styled.div`
  align-self: flex-start;
  background: #f7f7f7;
  color: #333;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 0.875rem;
  border-radius: 10px;
`;
