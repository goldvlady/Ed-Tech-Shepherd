import {
  Table,
  Thead,
  Tbody,
  Tr as ChakraTr,
  Th,
  Td as ChakraTd,
  Checkbox,
} from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";

export type TableColumn<T> = {
  title: string;
  dataIndex?: keyof T;
  key: string;
  render?: (record: T) => JSX.Element;
  align?: "center" | "left";
  id?: number;
};

export type TableProps<T> = {
  columns: TableColumn<T>[];
  dataSource: T[];
  isSelectable?: boolean;
  onSelect?: (selectedRowKeys: string[]) => void;
  fileImage?: any;
};

const StyledTh = styled(Th)<{}>`
  background: #f7f8fa;
  color: #6e7682;
  font-weight: 400;
  font-size: 12px;
  line-height: 17px;
  text-align: center;
  border-radius: 5px;
`;

const StyledTr = styled(ChakraTr)<{
  selectable?: boolean;
  active?: boolean;
  tagsColor?: string;
}>`
  &:hover {
    background: ${(props) => (props.selectable ? "#EEEFF2" : "inherit")};
  }

  background: ${(props) => (props.active ? "#F0F6FE" : "inherit")};

  cursor: ${(props) => (props.selectable ? "pointer" : "default")};
`;

const StyledTd = styled(ChakraTd)<{ tagsColor: string }>`
  padding: 15px 0;
  &:first-child,
  &:last-child {
    padding: 22px 5px;
  }
  border-bottom: 0.8px solid #eeeff2;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #585f68;
`;

const SelectableTable = <T extends Record<string, unknown>>({
  columns,
  dataSource,
  isSelectable,
  onSelect,
}: TableProps<T>) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const handleSelect = (record: T) => {
    const key = record.key as string;
    if (selectedRowKeys.includes(key)) {
      setSelectedRowKeys(selectedRowKeys.filter((k) => k !== key));
      onSelect && onSelect(selectedRowKeys.filter((k) => k !== key));
    } else {
      setSelectedRowKeys([...selectedRowKeys, key]);
      onSelect && onSelect([...selectedRowKeys, key]);
    }
  };

  return (
    <Table variant="unstyled">
      <Thead marginBottom={10}>
        <StyledTr>
          {isSelectable && <StyledTh />}
          {columns.map((col) => (
            <StyledTh key={col.key} textAlign={col.align || "center"}>
              {col.title}
            </StyledTh>
          ))}
        </StyledTr>
      </Thead>
      <Tbody>
        {dataSource.map((record) => (
          <StyledTr
            key={record.key as string}
            active={selectedRowKeys.includes(record.key as string)}
            selectable={isSelectable}
          >
            {isSelectable && (
              <StyledTd tagsColor={[record.tags].includes("#Che")}>
                <div style={{ padding: "0 5px" }}>
                  <Checkbox
                    borderRadius={"5px"}
                    isChecked={selectedRowKeys.includes(record.key as string)}
                    onChange={() => handleSelect(record)}
                  />
                </div>
              </StyledTd>
            )}
            {columns.map((col) => (
              <StyledTd
                key={col.key}
                tagsColor={col.dataIndex === "tags" ? record.tags : "#585f68"}
              >
                {col.render
                  ? col.render(record)
                  : col.dataIndex
                  ? record[col?.dataIndex]
                  : null}
              </StyledTd>
            ))}
          </StyledTr>
        ))}
      </Tbody>
    </Table>
  );
};

export default SelectableTable;
