import { StyledTd, StyledTh, StyledTr } from './styles';
import { Table, Thead, Tbody, Checkbox } from '@chakra-ui/react';
import { useState } from 'react';

const scrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '2px',
    height: '6px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#F2F4F7',
    borderRadius: '15px'
  },
  '&::-webkit-scrollbar-track': {
    background: '#F2F4F7',
    borderRadius: '15px'
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#888 #F2F4F7'
};

export type TableColumn<T = any> = {
  title: string;
  dataIndex?: keyof T;
  key: string;
  scrollX?: boolean; // New
  scrollY?: boolean; // New
  render?: (record: T) => JSX.Element;
  align?: 'center' | 'left';
  id?: number;
  height?: string | number; // <-- Added optional height
  width?: string | number; // <-- Add this line for the optional width
};

export type TableProps<T = any> = {
  columns: TableColumn<T>[];
  dataSource: T[];
  isSelectable?: boolean;
  onSelect?: (selectedRowKeys: string[]) => void;
  fileImage?: any;
  selectedRowKeys?: string[];
  setSelectedRowKeys?: React.Dispatch<React.SetStateAction<string[]>>;
  handleSelectAll?: () => void;
  allChecked?: boolean;
  setAllChecked?: any;
  setSelectedNoteIdToDelete?: any;
  selectedNoteIdToDelete?: any;
  setSelectedNoteIdToDeleteArray?: any;
  selectedNoteIdToDeleteArray?: any;
  selectedNoteIdToAddTagsArray?: any;
  setSelectedNoteIdToAddTagsArray?: any;
  setSelectedNoteIdToAddTags?: any;
  selectedNoteIdToAddTags?: any;
};

const SelectableTable = <T extends Record<string, unknown>>({
  columns,
  dataSource,
  isSelectable,
  onSelect,
  selectedRowKeys,
  setSelectedRowKeys,
  setSelectedNoteIdToDelete,
  selectedNoteIdToDelete,
  setSelectedNoteIdToDeleteArray,
  selectedNoteIdToDeleteArray,
  handleSelectAll,
  allChecked,
  setSelectedNoteIdToAddTagsArray,
  selectedNoteIdToAddTagsArray,
  selectedNoteIdToAddTags,
  setSelectedNoteIdToAddTags
}: TableProps<T>) => {
  const handleSelect = (record: T) => {
    const key = record.key as string;

    const id = record.id as any;

    if (selectedRowKeys?.includes(key)) {
      setSelectedRowKeys?.(selectedRowKeys.filter((k) => k !== key));
      onSelect &&
        onSelect([...(selectedRowKeys?.filter((k) => k !== key) || [])]);
      onSelect && onSelect(selectedRowKeys?.filter((k) => k !== key) || []);

      setSelectedNoteIdToDeleteArray &&
        setSelectedNoteIdToDeleteArray((prevArray) =>
          prevArray.filter((noteId) => noteId !== id)
        );
      setSelectedNoteIdToAddTagsArray &&
        setSelectedNoteIdToAddTagsArray((prevArray) =>
          prevArray.filter((noteId) => noteId !== id)
        );
    } else {
      setSelectedRowKeys?.([...(selectedRowKeys || []), key]);
      onSelect && onSelect([...(selectedRowKeys || []), key]);
    }

    // Set the selected note ID for deletion

    setSelectedNoteIdToDelete && setSelectedNoteIdToDelete(id);
    setSelectedNoteIdToDeleteArray &&
      setSelectedNoteIdToDeleteArray((prevArray) => [...prevArray, id]);

    // Set the selected note ID add tags
    setSelectedNoteIdToAddTags && setSelectedNoteIdToAddTags(id);
    setSelectedNoteIdToAddTagsArray &&
      setSelectedNoteIdToAddTagsArray((prevArray) => [...prevArray, id]);
  };

  return (
    <Table size="sm" variant="unstyled" width={{ base: '100em', md: '100%' }}>
      <Thead marginBottom={10}>
        <StyledTr>
          {isSelectable && (
            <StyledTh>
              <Checkbox isChecked={allChecked} onChange={handleSelectAll} />
            </StyledTh>
          )}

          {columns.map((col) => (
            <StyledTh
              key={col.key}
              textAlign={col.align || 'left'}
              width={col.width}
            >
              {' '}
              {/* Set width here */}
              {col.title}
            </StyledTh>
          ))}
        </StyledTr>
      </Thead>
      <Tbody>
        {dataSource.map((record) => (
          <StyledTr
            key={record.key as string}
            active={selectedRowKeys?.includes(record.key as string)}
            selectable={isSelectable}
          >
            {isSelectable && (
              <StyledTd tagsColor={[record.tags].includes('#Che')}>
                <div style={{ padding: '0 5px' }}>
                  <Checkbox
                    borderRadius={'5px'}
                    isChecked={selectedRowKeys?.includes(record.key as string)}
                    onChange={() => handleSelect(record)}
                  />
                </div>
              </StyledTd>
            )}

            {columns.map((col) => (
              <StyledTd
                key={col.key}
                fontWeight="500"
                maxW={col.width}
                marginRight={col.width && '10px'}
                maxH={col.height}
                overflowX={col.scrollX ? 'hidden' : 'auto'}
                overflowY={col.scrollY ? 'hidden' : 'auto'}
                css={scrollbarStyles}
                textAlign={col.align || 'left'}
                style={{
                  width: col.width,
                  height: col.height
                }}
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
