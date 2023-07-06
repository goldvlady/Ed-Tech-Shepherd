import { StyledTd, StyledTh, StyledTr } from './styles';
import { Table, Thead, Tbody, Checkbox } from '@chakra-ui/react';
import { useState } from 'react';

export type TableColumn<T = any> = {
  title: string;
  dataIndex?: keyof T;
  key: string;
  render?: (record: T) => JSX.Element;
  align?: 'center' | 'left';
  id?: number;
};

export type TableProps<T = any> = {
  columns: TableColumn<T>[];
  dataSource: T[];
  isSelectable?: boolean;
  onSelect?: (selectedRowKeys: string[]) => void;
  fileImage?: any;
};

const SelectableTable = <T extends Record<string, unknown>>({
  columns,
  dataSource,
  isSelectable,
  onSelect
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
            <StyledTh key={col.key} textAlign={col.align || 'center'}>
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
              <StyledTd tagsColor={[record.tags].includes('#Che')}>
                <div style={{ padding: '0 5px' }}>
                  <Checkbox
                    borderRadius={'5px'}
                    isChecked={selectedRowKeys.includes(record.key as string)}
                    onChange={() => handleSelect(record)}
                  />
                </div>
              </StyledTd>
            )}
            {columns.map((col) => (
              <StyledTd
                key={col.key}
                tagsColor={col.dataIndex === 'tags' ? record.tags : '#585f68'}
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
