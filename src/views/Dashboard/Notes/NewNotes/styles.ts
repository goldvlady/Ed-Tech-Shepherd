import styled from "styled-components";

export const NewNoteWrapper = styled.section`
  padding: 0;
`;

export const Header = styled.section`
  background: #fafafa;
  border: 1px solid #eeeff2;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 8px;
`;

export const FirstSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px;

  .zoom__icn {
    border-right: 1px solid #e0e1e1;
    padding-right: 20px;
    cursor: pointer;
  }

  .doc__name {
    border-right: 1px solid #e0e1e1;
    padding-right: 20px;
    > p {
      color: #525456;
      font-size: 0.875rem;
    }
  }

  .timestamp {
    color: #9a9c9e;
    font-size: 0.875rem;
  }
`;

export const SecondSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px;

  .pin__icn {
    border-right: 1px solid #e0e1e1;
    padding-right: 20px;
    cursor: pointer;
  }
`;

export const NoteBody = styled.section`
  padding: 10px 30px;
  height: 100vh;
  background: ;
`;

export const DropDownLists = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  font-size: 0.875rem;

  :hover {
    background: #f2f4f8;
    border-radius: 6px;
    cursor: pointer;
  }

  &:nth-child(4) {
    border-bottom: 1px solid #e8e8e9;
  }
`;

export const DropDownFirstPart = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: space-between;
  width: 100%;

  > div {
    display: flex;
    align-items: center;

    &p:nth-child(last) {
      color: #f53535;
    }
  }
`;

export const DropDownDelete = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
