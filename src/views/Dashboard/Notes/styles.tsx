import styled from "styled-components";

export const Header = styled.header`
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;

  h4 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    font-size: 2rem;
  }
`;

export const Section = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 7rem;
  width: 100%;

  > div {
    text-align: center;

    p {
      margin-bottom: 10px;
    }
  }
`;

export const StyledSection = styled.section`
  display: flex;
  flex-direction: column;

  & > div {
    margin-bottom: 1rem;
  }

  p.text-label {
    color: #969ca6;
    font-size: 0.75rem;
    padding-left: 6px;
  }

  p.text-value {
    font-size: 0.875rem;
    padding: 6px;
    border-radius: 0.25rem;
    cursor: pointer;

    &:hover {
      background-color: #f2f4f7;
    }
  }
`;

export const StyledHeader = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span.font-bold {
    font-size: 1.5rem;
  }

  span.count-badge {
    display: inline-block;
    font-size: 0.875rem;
    background-color: #e5e7eb;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    color: #6b7280;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
`;

export const Checkbox = styled.input`
  height: 1rem;
  width: 1rem;
  border-radius: 0.25rem;
  border: 1px solid gray;
  cursor: pointer;
`;

export const Text = styled.p`
  font-size: 0.875rem;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 35px;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  border: 1px solid #e2e4e9;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  outline: none;
`;

export const SectionNewList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 0 !important;
`;

export const NewList = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 !important;
  > p {
    margin-bottom: 4px !important;
    font-size: 0.875rem;
  }
  &:hover {
    background: #f2f4f7;
    cursor: pointer;
    border-radius: 8px;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;
