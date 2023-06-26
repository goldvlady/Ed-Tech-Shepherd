import { Table, Thead, Tbody, Tr, Th, Td, Checkbox } from "@chakra-ui/react";
import styled from "styled-components";
import { useState } from "react";

type Column = {
  title: string;
  dataIndex: string;
  key: string;
  render?: (record: Record<string, unknown>) => JSX.Element;
  align?: "center" | "left";
};

type TableProps = {
  columns: Column[];
  dataSource: Record<string, unknown>[];
  isSelectable?: boolean;
  onSelect?: (selectedRowKeys: string[]) => void;
};

const StyledTh = styled(Th)`
  background: #f7f8fa;
  color: #6e7682;
`;

const StyledTd = styled(Td)`
  padding: 4px;
  border-bottom: 0.8px solid #eeeff2;
`;

const SelectableTable = ({
  columns,
  dataSource,
  isSelectable,
  onSelect,
}: TableProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const handleSelect = (record: Record<string, unknown>) => {
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
      <Thead>
        <Tr>
          {isSelectable && <Th />}
          {columns.map((col) => (
            <StyledTh key={col.key} textAlign={col.align || "left"}>
              {col.title}
            </StyledTh>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {dataSource.map((record) => (
          <Tr key={record.key as string}>
            {isSelectable && (
              <Td>
                <Checkbox
                  isChecked={selectedRowKeys.includes(record.key as string)}
                  onChange={() => handleSelect(record)}
                />
              </Td>
            )}
            {columns.map((col) => (
              <StyledTd key={col.key}>
                {col.render ? col.render(record) : record[col.dataIndex]}
              </StyledTd>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default SelectableTable;
