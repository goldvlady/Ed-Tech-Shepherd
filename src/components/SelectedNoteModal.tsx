import { storage } from '../firebase';
import ApiService from '../services/AiService';
import userStore from '../state/userStore';
import CustomButton from './CustomComponents/CustomButton';
import CustomModal from './CustomComponents/CustomModal/index';
import { UploadIcon } from './icons';
import { Spinner } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import {
  ref,
  uploadBytesResumable,
  listAll,
  getDownloadURL
} from 'firebase/storage';
import { useRef, useState, useEffect, RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

type List = {
  name: string;
  fullPath: string;
};

interface ShowProps {
  show: boolean;
  setShow: (show: boolean) => void;
  setShowHelp: (showHelp: boolean) => void;
}

const SelectedModal = ({ show, setShow, setShowHelp }: ShowProps) => {
  const { user } = userStore();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState('');
  const [list, setList] = useState<Array<List>>([]);
  const [file, setFile] = useState<Blob | Uint8Array | ArrayBuffer>();
  const [selectedOption, setSelectedOption] = useState('');
  const [docPath, setDocPath] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [loadedList, setLoadedList] = useState(false);
  const inputRef = useRef(null) as RefObject<HTMLInputElement>;
  const [isLoading, setIsLoading] = useState(false);

  const Wrapper = styled.div`
    display: block;
  `;

  const Content = styled.div`
    padding: 16px;
    /* Add styles for the content div */
  `;

  const Label = styled.label`
    display: block;
    font-size: 0.875rem;
    font-weight: medium;
    color: var(--gray-500);
  `;

  const Select = styled.select`
    margin-top: 0.5rem;
    display: block;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #e4e5e7;
    padding: 0.5rem 0.75rem;
    color: #e4e5e7;
    background-color: #ffffff;
    outline: none;
    cursor: pointer;
  `;

  const OrText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1.5rem;
    font-size: 0.875rem;
    font-weight: medium;
    color: var(--gray-400);
  `;

  const FileUploadButton = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.375rem;
    background-color: #fff;
    border: 1px solid var(--primaryBlue);
    padding: 0.375rem 0.75rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: medium;
    color: var(--text-color);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: var(--blue-50);
    }
  `;

  const FileUploadIcon = styled(UploadIcon)`
    width: 1.25rem;
    height: 1.25rem;
    color: #e4e5e7;
  `;

  const FileName = styled.span`
    font-size: 0.875rem;
    font-weight: 700;
    color: #585f68;
  `;

  const Progress = styled.span`
    font-size: 0.875rem;
    font-weight: medium;
    color: purple;
    margin-left: 0.5rem;
  `;

  const PDFTextContainer = styled.div`
    text-align: center;
    margin-bottom: 1.5rem;
  `;

  const Text = styled.p`
    font-size: 0.875rem;
    text-align: left;
    line-height: 1.5;
    color: var(--gray-600);
  `;

  const Format = styled.span`
    font-weight: bold;
    color: var(--secondaryGray);
  `;

  useEffect(() => {
    const { currentUser } = getAuth();
    const listEverything = async (path) => {
      const listRef = ref(storage, path);
      listAll(listRef).then((res) => setList(res.items));
    };

    if (currentUser?.uid) {
      setDocPath(currentUser.uid);
      listEverything(currentUser?.uid);
      setLoadedList(true);
    }
  }, [docPath]);

  const clickInput = () => {
    inputRef?.current && inputRef.current.click();
  };

  const collectFile = (e) => {
    const { name } = e.target.files[0];
    setUploadError('');
    setFileName(name);
    setFile(e.target.files[0]);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };
  const handleClose = () => {
    setShow(false);
  };

  const handleSelected = (e: any) => {
    setSelectedOption(e.target.value);
  };

  const processOrContinue = async () => {
    if (!file && !selectedOption)
      return setUploadError("You haven't uploaded a file or selected a note.");

    if (selectedOption && user) {
      const documentUrl = await getDownloadURL(ref(storage, selectedOption));
      const item = list.filter((list) => list.fullPath === selectedOption);
      await ApiService.processDocument({
        studentId: user?._id,
        documentId: item[0].name,
        documentURL: documentUrl
      }).then(() => {
        setShow(false);
        setShowHelp(false);
        navigate('/dashboard/docchat', {
          state: {
            documentUrl,
            docTitle: item[0].name
          }
        });
      });
    }

    if (file && user) {
      const storageRef = ref(
        storage,
        `${docPath}/${fileName.toLowerCase().replace(/\s/g, '')}`
      );
      const task = uploadBytesResumable(storageRef, file);

      task.on(
        'state_changed',
        (snapshot) => {
          const progress = `Upload is ${Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          )}% done`;
          switch (snapshot.state) {
            case 'running':
              setProgress(progress);
              break;
          }
        },
        (error) => {
          setUploadError(`Error: ${error.message}`);
        },
        async () => {
          setProgress('Complete!');
          const documentURL = await getDownloadURL(task.snapshot.ref);
          const title = task.snapshot.metadata.name;

          await ApiService.processDocument({
            studentId: user?._id,
            documentId: fileName,
            documentURL
          }).then(() => {
            setShow(false);
            setShowHelp(false);
            navigate('/dashboard/docchat', {
              state: {
                documentUrl: documentURL,
                docTitle: title
              }
            });
          });
        }
      );
    }
  };

  return (
    <CustomModal
      isOpen={show}
      onClose={handleClose}
      modalTitle="Select note"
      style={{
        maxWidth: '400px',
        height: 'auto'
      }}
      modalTitleStyle={{
        textAlign: 'center',
        borderBottom: '1px solid #EEEFF2'
      }}
      footerContent={
        <div style={{ display: 'flex', gap: '8px' }}>
          <CustomButton
            type="button"
            isCancel
            onClick={handleClose}
            title="Cancel"
          />
          <CustomButton
            type="button"
            onClick={processOrContinue}
            title="Confirm"
          />
        </div>
      }
    >
      <Wrapper>
        <div className="p-4">
          {loadedList && (
            <div>
              <Label htmlFor="note">Select note</Label>
              <Select
                id="note"
                name="note"
                defaultValue="Select from your note"
                onChange={handleSelected}
              >
                {loadedList &&
                  list.map((item, id) => (
                    <option value={item.fullPath} key={id}>
                      {item.name}
                    </option>
                  ))}
              </Select>
              <OrText>Or</OrText>
            </div>
          )}

          <FileUploadButton onClick={clickInput}>
            <span className="flex items-center space-x-2">
              <FileUploadIcon
                className="text-primaryGray w-5 h-5"
                onClick={undefined}
              />
              <span className="text-dark">Upload doc</span>
            </span>

            {/* Uploading Progress */}
            {isLoading && (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="md"
              />
            )}
          </FileUploadButton>
          {uploadError && <p className="text-sm text-red-700">{uploadError}</p>}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            id="file-upload"
            ref={inputRef}
            onChange={collectFile}
          />
          <PDFTextContainer>
            <Text>
              Shepherd supports <Format>.pdf, .ppt, .jpg & .txt</Format>{' '}
              document formats
            </Text>
          </PDFTextContainer>
          {fileName && <FileName>{fileName}</FileName>}
          {progress && <Progress>{progress}</Progress>}
        </div>
      </Wrapper>
    </CustomModal>
  );
};

export default SelectedModal;
