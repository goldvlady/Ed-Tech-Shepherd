import { storage } from '../firebase';
import { MAX_FILE_UPLOAD_LIMIT } from '../helpers/constants';
import { checkDocumentStatus, processDocument } from '../services/AI';
import userStore from '../state/userStore';
import CustomButton from './CustomComponents/CustomButton';
import CustomModal from './CustomComponents/CustomModal/index';
import CustomDropdown from './CustomDropdown';
import { UploadIcon } from './icons';
import { AttachmentIcon } from '@chakra-ui/icons';
import {
  CircularProgress as CircularProgressBar,
  CircularProgressLabel,
  Alert,
  AlertTitle,
  AlertDescription,
  VStack
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  updateMetadata,
  deleteObject
} from 'firebase/storage';
import { useRef, useState, useEffect, RefObject, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

type List = {
  name: string;
  fullPath: string;
  customMetadata: {
    ingest_status: 'success' | 'too_large';
  };
};

interface ShowProps {
  show: boolean;
  setShow: (show: boolean) => void;
  setShowHelp: (showHelp: boolean) => void;
}

interface UiMessage {
  status: 'error' | 'success' | 'info' | 'warning' | 'loading' | undefined;
  heading: string;
  description: string;
}

const SelectedModal = ({ show, setShow, setShowHelp }: ShowProps) => {
  const { user, userDocuments } = userStore();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [uiMessage, setUiMessage] = useState<UiMessage | null>(null);
  const [list, setList] = useState<Array<List>>([]);
  const [canUpload, setCanUpload] = useState(true);
  const [file, setFile] = useState<Blob | Uint8Array | ArrayBuffer>();
  const [selectedOption, setSelectedOption] = useState<any>();
  const [confirmReady, setConfirmReady] = useState(false);
  const [docPath, setDocPath] = useState('');
  const [loadedList, setLoadedList] = useState(false);
  const inputRef = useRef(null) as RefObject<HTMLInputElement>;
  const { currentUser } = useMemo(() => getAuth(), []);

  const Wrapper = styled.div`
    display: block;
    width: 100%;
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

    &:valid {
      color: #000;
      background-color: #c9fcff;
    }
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
    background-color: ${canUpload ? '#fff' : '#e4e5e7'};
    border: 1px solid var(--primaryBlue);
    padding: 0.375rem 0.75rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: medium;
    color: var(--text-color);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: background-color 0.03s;
    height: 40px;

    &:hover {
      background-color: ${(!fileName || canUpload) && '#f0fff3'};
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

  const PDFTextContainer = styled.div`
    text-align: center;
    margin-bottom: 1.5rem;
  `;

  const Text = styled.p`
    font-size: 0.8rem;
    text-align: left;
    line-height: 1.5;
    color: var(--gray-600);
  `;

  const Format = styled.span`
    font-weight: bold;
    color: var(--secondaryGray);
  `;

  useEffect(() => {
    if (currentUser?.uid) {
      setDocPath(currentUser.uid);
      setLoadedList(true);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    setList(userDocuments);
  }, [userDocuments]);

  const clickInput = () => {
    if (canUpload) inputRef?.current && inputRef.current.click();
  };

  const collectFile = async (e) => {
    const { name } = e.target.files[0];
    setUiMessage(null);
    setFileName(name);
    setFile(e.target.files[0]);

    await handleFreshUpload(e.target.files[0], user, name);
  };
  const handleClose = () => {
    setShow(false);
  };

  const handleSelected = (e) => {
    if (e.target.value) {
      setSelectedOption(e.target.value);
      setCanUpload(false);
      setConfirmReady(true);
    }
  };

  const checkIfDocumentPresent = () => {
    if (!selectedOption)
      setUiMessage({
        status: 'error',
        heading: 'No document selected',
        description: "You haven't selected a note. Select one, and try again."
      });
    setConfirmReady(false);
    return;
  };

  const handleFreshUpload = async (file, user, fileName) => {
    const readableFileName = fileName.toLowerCase().replace(/\s/g, '');
    const SIZE_IN_MB = parseInt((file?.size / 1_000_000).toFixed(2), 10);
    if (SIZE_IN_MB > MAX_FILE_UPLOAD_LIMIT) {
      setUiMessage({
        status: 'error',
        heading: 'Your file is too large',
        description: `Your file is ${SIZE_IN_MB}MB, above our 5MB limit. Please upload a smaller document.`
      });
      return;
    }
    setProgress(5);
    const storageRef = ref(storage, `${docPath}/${readableFileName}`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        switch (snapshot.state) {
          case 'running':
            setProgress(progress);
            break;
        }
      },
      (error) => {
        setUiMessage({
          status: 'error',
          heading: 'Something went wrong',
          description: error.message
        });
      },
      async () => {
        setUiMessage({
          status: 'info',
          heading: 'Document uploaded!',
          description:
            'Hang on while we check the contents of your document. This may take 1-5 minutes.'
        });
        const documentURL = await getDownloadURL(task.snapshot.ref);

        await processDocument({
          studentId: user?._id,
          documentId: readableFileName,
          documentURL,
          title: readableFileName
        })
          .then(async () => {
            let counter = 0;
            let done = false;

            const checkStatus = async () => {
              try {
                const check = await checkDocumentStatus({
                  studentId: user?._id,
                  documentId: readableFileName
                });
                if (check.status === 'ingested') {
                  const metadata = {
                    customMetadata: {
                      ingest_status: 'success'
                    }
                  };
                  await updateMetadata(storageRef, metadata);
                  setSelectedOption(() => storageRef.fullPath);
                  done = true;

                  setUiMessage({
                    status: 'info',
                    heading: 'Processing complete!',
                    description:
                      'Click "confirm" to start chatting with your document.'
                  });

                  setConfirmReady(true);
                }
                if (check.status === 'too_large') {
                  const metadata = {
                    customMetadata: {
                      ingest_status: 'too_large'
                    }
                  };
                  await updateMetadata(storageRef, metadata);
                  return setUiMessage({
                    status: 'error',
                    heading: 'Your document was too long.',
                    description:
                      'Your document is over 12,000 words. Consider uploading a shorter document.'
                  });
                  done = true;
                }
              } catch (e: any) {
                setUiMessage({
                  status: 'error',
                  heading: 'Something went wrong',
                  description: e.message
                });
              } finally {
                counter++;
                if (done || counter > 20) clearInterval(intervalId);

                if (counter > 20 && !done) {
                  setUiMessage({
                    status: 'error',
                    heading: "We couldn't process your document",
                    description:
                      'There was something wrong with your document. Please send a message to someone on the Shepherd team to look into this problem.'
                  });
                }
              }
            };

            const intervalId = setInterval(checkStatus, 5000);
          })
          .catch(async (e: any) => {
            await deleteObject(storageRef);
            return setUiMessage({
              status: 'error',
              heading: 'Something went wrong. Reload this page and try again.',
              description: e.message
            });
          });
      }
    );
  };

  const goToDocChat = async () => {
    const documentUrl = await getDownloadURL(ref(storage, selectedOption));
    const item = list.filter((list) => list.fullPath === selectedOption);
    console.log('Yummy', item, 'URL', documentUrl);
    navigate('/dashboard/docchat', {
      state: {
        documentUrl,
        docTitle: item[0].name
      }
    });

    window.location.reload();
  };

  const doNothing = () => {
    return;
  };

  const proceed = async () => {
    checkIfDocumentPresent();
    await goToDocChat();
    setShow(false);
    setShowHelp(false);
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
            onClick={confirmReady ? proceed : doNothing}
            active={confirmReady}
            title="Confirm"
          />
        </div>
      }
    >
      <Wrapper>
        <div className="p-4" style={{ width: '100%' }}>
          {loadedList && (
            <div style={{ width: '-webkit-fill-available' }}>
              <Label htmlFor="note">Select note</Label>
              <CustomDropdown
                value={selectedOption?.split('/').pop()}
                placeholder="Select an Option"
              >
                <VStack alignItems={'left'} padding="10px" width="100%">
                  {loadedList &&
                    list.map((item, id) => {
                      return (
                        <option
                          value={item.fullPath}
                          key={id}
                          onClick={handleSelected}
                          style={{
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          {item.name}
                        </option>
                      );
                    })}
                </VStack>
              </CustomDropdown>
              <OrText>Or</OrText>
            </div>
          )}

          <FileUploadButton onClick={clickInput}>
            <span className="flex items-center space-x-2">
              {fileName ? (
                <AttachmentIcon />
              ) : (
                <FileUploadIcon
                  className="text-primaryGray w-5 h-5"
                  onClick={undefined}
                />
              )}
              {fileName ? (
                <FileName>{fileName}</FileName>
              ) : (
                <span className="text-dark">Upload doc</span>
              )}
            </span>
            {/* Uploading Progress */}
            {!!progress && (
              <CircularProgressBar value={progress} color="#207DF7" size="40px">
                <CircularProgressLabel>{progress}%</CircularProgressLabel>
              </CircularProgressBar>
            )}
          </FileUploadButton>
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
              Shepherd supports <Format>.pdf</Format> document formats
            </Text>
          </PDFTextContainer>
          {uiMessage && (
            <Alert
              status={uiMessage.status}
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="max-content"
            >
              <AlertTitle mt={2} mb={1} fontSize="md" textColor="black">
                {uiMessage.heading}
              </AlertTitle>
              <AlertDescription maxWidth="sm" textColor="black">
                {uiMessage.description}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Wrapper>
    </CustomModal>
  );
};

export default SelectedModal;
