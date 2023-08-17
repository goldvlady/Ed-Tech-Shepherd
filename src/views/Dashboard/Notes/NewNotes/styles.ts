import theme from '../../../../theme/';
import styled from 'styled-components';

export const NewNoteWrapper = styled.section<{
  position?: string;
  width?: string;
  height?: string;
  background?: string;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  zIndex?: number;
}>`
  padding: 0;
  position: ${(props) => props.position ?? 'relative'};
  /* width: ${(props) => props.width ?? '210mm'}; */
  width: ${(props) => props.width ?? '250mm'};
  margin: 0 auto;
  height: ${(props) => props.height ?? '297mm'};
  top: ${(props) => props.top ?? undefined};
  right: ${(props) => props.right ?? undefined};
  bottom: ${(props) => props.bottom ?? undefined};
  left: ${(props) => props.left ?? undefined};
  z-index: ${(props) => props.zIndex ?? undefined};
  background-color: ${(props) => props.background ?? theme.color.background};
`;
export const FullScreenNoteWrapper = styled.div`
  width: 70% !important;
  margin: 0 auto;
`;

export const PDFWrapper = styled.div`
  display: flex;
  width: '100%';
  flex-direction: column;
  height: '100%';
  align-items: flex-start;
  justify-content: center;
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
  .back-btn {
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.25rem;
    color: #585f68;
    margin-left: -0.5em;
    cursor: pointer;
  }
  .zoom__icn {
    border-right: 1px solid #e0e1e1;
    padding-right: 20px;
    cursor: pointer;
  }

  .doc__name {
    cursor: text;
    color: #525456;
    display: flex;
    flex-direction: row;
    font-size: 11pt;
    min-width: 120px;
    max-height: 30px;
    width: '100%';
    border-right: 1px solid #e0e1e1;
    padding-right: 10px;
    > input {
      width: inherit;
      height: 'inherit';
      margin: 0;
      padding: 0;
      border-style: flat !important;
      font-size: 11pt;
      color: #525456;
      background: #fafafa !important;
    }
  }

  .doc__name:hover {
    > div {
      border: 1px solid #e0e1e1;
    }
  }

  .timestamp {
    color: #9a9c9e;
    font-size: 0.875rem;
    cursor: default;
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
  .pin-icon {
    cursor: pointer;
    font-size: 1.5em;
  }

  .pin-icon.pinned {
    color: rgb(32, 125, 247);
  }

  .pin-icon.not-pinned {
    color: grey;
  }
`;

export const NoteBody = styled.section`
  padding: 10px 10px;
  height: 100vh;
  background: '#ffffff';
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

  &:nth-child(5) {
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

export const HeaderButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  padding: ${(props) => theme.layout.padding.paddingMedium + 'px'};
`;

export const HeaderButtonText = styled.p`
  margin-left: ${(props) => theme.layout.padding.paddingMedium + 'px'};
  font-size: 10pt;
`;
