import { TrashIcon } from '../icons';
import { TableTitleWrapper } from '../notesTab/styles';
import SelectableTable, { TableColumn } from '../table';
import { Text } from '@chakra-ui/react';
import { AlertStatus, ToastPosition } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import moment from 'moment';
import { FC, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

type DataSourceItem = {
  key: number;
  title: string;
  dateCreated: string;
  lastModified: string;
  id: string | number;
  documentURL?: string;
};

export interface Props {
  data: any;
}

const formatDate = (date: Date, format = 'DD ddd, hh:mma'): string => {
  return moment(date).format(format);
};

const AllDocumentTab: FC<Props> = ({ data }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [selectedNoteIdToDelete, setSelectedNoteIdToDelete] = useState(null);
  const [selectedNoteIdToDeleteArray, setSelectedNoteIdToDeleteArray] =
    useState<string[]>([]);
  const [selectedNoteIdToAddTagsArray, setSelectedNoteIdToAddTagsArray] =
    useState<string[]>([]);
  const [selectedNoteIdToAddTags, setSelectedNoteIdToAddTags] = useState(null);

  const [dataSource] = useState<DataSourceItem[]>(
    Array.from({ length: data.length }, (_, i) => ({
      key: i,
      id: data[i]?.id,
      title: data[i]?.title,
      dateCreated: formatDate(data[i]?.createdAt),
      lastModified: formatDate(data[i]?.updatedAt),
      documentURL: data[i]?.documentURL
    }))
  );

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPeople.length > 0 && selectedPeople.length < data.length;
    setChecked(selectedPeople.length === data.length);
    setIndeterminate(isIndeterminate);
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedPeople]);

  const handleSelectAll = () => {
    if (!allChecked) {
      const newSelectedRowKeys = dataSource.map(
        (data) => data.key as unknown as string
      );

      setSelectedRowKeys(newSelectedRowKeys);

      const newSelectedNoteIds = dataSource.map((data) => data.id);
      const newSelectedNoteIdsAsString = newSelectedNoteIds.map((id) =>
        id.toString()
      );
      // Append the new selected note IDs to the existing array
      setSelectedNoteIdToDeleteArray((prevArray) => [
        ...prevArray,
        ...newSelectedNoteIdsAsString
      ]);

      setSelectedNoteIdToAddTagsArray((prevArray) => [
        ...prevArray,
        ...newSelectedNoteIdsAsString
      ]);
    } else {
      setSelectedRowKeys([]);
      setSelectedPeople([]);
      setSelectedNoteIdToDelete(null);
      setSelectedNoteIdToAddTags(null);
    }
    setAllChecked(!allChecked);
  };

  function Done() {
    setSelectedRowKeys([]);
    setSelectedPeople([]);
    setAllChecked(false);

    setSelectedNoteIdToDelete(null);
  }

  const gotoEditPdf = async (
    noteId: string | number,
    documentUrl,
    docTitle
  ) => {
    try {
      navigate(`/dashboard/new-note`, {
        state: {
          documentUrl,
          docTitle
        }
      });
    } catch (error) {
      // console.log({ error });
    }
  };

  const clientColumn: TableColumn<DataSourceItem>[] = [
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
      align: 'left',
      id: 0,
      render: ({ title, id, documentURL }) => (
        <TableTitleWrapper>
          <Text
            onClick={() => gotoEditPdf(id, documentURL, title)}
            fontWeight="500"
          >
            {title}
          </Text>
        </TableTitleWrapper>
      )
    },
    {
      key: 'dateCreated',
      title: 'Date Created',
      dataIndex: 'dateCreated',
      align: 'left',
      id: 2
    },
    {
      key: 'lastModified',
      title: 'Last Modified',
      dataIndex: 'lastModified',
      align: 'left',
      id: 3
    }
  ];

  return (
    <>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle h-screen sm:px-6 lg:px-8 z-10">
            <div className="relative">
              <div className="table-columns  fixed bottom-[80px] right-[36%] left-[36%]">
                {selectedPeople.length > 0 || allChecked ? (
                  <div className="top-0 border px-4 py-8 text-sm rounded-md flex h-12 items-center justify-between space-x-3 w-[600px] bg-white sm:left-12">
                    <p className="text-gray-600">
                      {selectedPeople.length} items selected
                    </p>

                    <div className="flex items-center space-x-4">
                      <button
                        className="text-gray-600"
                        onClick={handleSelectAll}
                      >
                        {allChecked ? 'Deselect all' : 'Select all'}
                      </button>
                    </div>

                    {selectedPeople.length > 1 || allChecked ? (
                      <button
                        type="button"
                        className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        onClick={undefined}
                      >
                        <TrashIcon className="w-5" onClick={undefined} />
                        <span>Delete All</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                        onClick={undefined}
                      >
                        <TrashIcon className="w-5" onClick={undefined} />
                        <span>Delete</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="inline-flex items-center rounded-lg bg-white px-6 py-2 text-sm text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      onChange={Done}
                    >
                      Done
                    </button>
                  </div>
                ) : null}
              </div>
              <SelectableTable
                columns={clientColumn}
                dataSource={dataSource}
                isSelectable
                fileImage
                onSelect={(e) => setSelectedPeople(e)}
                selectedRowKeys={selectedRowKeys}
                setSelectedRowKeys={setSelectedRowKeys}
                handleSelectAll={handleSelectAll}
                allChecked={allChecked}
                setAllChecked={setAllChecked}
                setSelectedNoteIdToDelete={setSelectedNoteIdToDelete}
                selectedNoteIdToDelete={selectedNoteIdToDelete}
                setSelectedNoteIdToDeleteArray={setSelectedNoteIdToDeleteArray}
                selectedNoteIdToDeleteArray={selectedNoteIdToDeleteArray}
                selectedNoteIdToAddTagsArray={selectedNoteIdToAddTagsArray}
                setSelectedNoteIdToAddTagsArray={
                  setSelectedNoteIdToAddTagsArray
                }
                selectedNoteIdToAddTags={selectedNoteIdToAddTags}
                setSelectedNoteIdToAddTags={setSelectedNoteIdToAddTags}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllDocumentTab;
