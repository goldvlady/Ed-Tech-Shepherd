import { storage } from '../firebase';
import { MAX_FILE_UPLOAD_LIMIT } from '../helpers/constants';
import { processDocument } from '../services/AI';
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
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRef, useState, useEffect, RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const DocumentListWrapper = styled.div`
  max-height: 200px;
  background-color: 'green';
`;

type Documents = {
  title: string;
  documentURL: string;
};

interface ShowProps {
  show: boolean;
  setShow: (show: boolean) => void;
  setShowHelp: (showHelp: boolean) => void;
  chatButton?: boolean;
  okayButton?: boolean;
  cancelButton?: boolean;
}

interface UiMessage {
  status: 'error' | 'success' | 'info' | 'warning' | 'loading' | undefined;
  heading: string;
  description: string;
}

const SelectedModal = ({
  show,
  setShow,
  setShowHelp,
  chatButton = true,
  cancelButton = true,
  okayButton
}: ShowProps) => {
  const { user, userDocuments } = userStore();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uiMessage, setUiMessage] = useState<UiMessage | null>(null);
  const [canUpload, setCanUpload] = useState(true);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [confirmReady, setConfirmReady] = useState(false);
  const [loadedStudentDocs, setLoadedStudentDocs] = useState(false);
  const inputRef = useRef(null) as RefObject<HTMLInputElement>;
  const [studentDocuments, setStudentDocuments] = useState<Array<any>>([]);
  const [documentURL, setDocumentURL] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [loading, setLoading] = useState(false);

  const Wrapper = styled.div`
    display: block;
    width: 100%;
    .error-message {
      text-align: center !important;
      color: red;
    }
    .drop-down-container {
      max-height: 150px;
      max-width: 100%;
      overflow: scroll;
      ::-webkit-scrollbar {
        display: none;
      }
    }
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
    if (userDocuments.length) {
      setLoadedStudentDocs(true);
      setStudentDocuments(userDocuments);
    }
  }, [userDocuments]);

  const clickInput = () => {
    if (canUpload) inputRef?.current && inputRef.current.click();
  };

  const handleClose = () => {
    setShow(false);
  };

  const collectFileInput = async (e) => {
    const inputFile = e.target.files[0];
    if (inputFile) {
      setLoading(true);
      setUiMessage({
        status: 'info',
        heading: 'Uploading...',
        description: ''
      });
      try {
        setFile(inputFile);
        setFileName(inputFile.name);
        await handleInputFreshUpload(inputFile, user, inputFile.name);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    }
  };

  const collectFile = async () => {
    if (!file) {
      setUiMessage({
        status: 'error',
        heading: 'Please select a file',
        description: 'Input cannot be empty.'
      });
      return;
    }
    if (file) {
      setLoading(true);
      setUiMessage({
        status: 'info',
        heading: 'Processing...',
        description: ''
      });
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await handleFreshUpload(file, user, fileName);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
        setFile(null);
      }
    }
  };

  const handleInputFreshUpload = async (file, user, fileNamet) => {
    const readableFileName = fileNamet.toLowerCase().replace(/\s/g, '');
    if (!user?._id || !readableFileName) {
      return setUiMessage({
        status: 'error',
        heading: 'Something went wrong',
        description:
          "We couldn't retrieve your user details to start the upload process."
      });
    }
    const SIZE_IN_MB = parseInt((file?.size / 1_000_000).toFixed(2), 10);
    if (SIZE_IN_MB > MAX_FILE_UPLOAD_LIMIT) {
      setUiMessage({
        status: 'error',
        heading: 'Your file is too large',
        description: `Your file is ${SIZE_IN_MB}MB, above our ${MAX_FILE_UPLOAD_LIMIT}MB limit. Please upload a smaller document.`
      });
      return;
    }
    setProgress(5);
    const customFirestorePath = `${user._id}/${readableFileName}`;
    const storageRef = ref(storage, customFirestorePath);
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
          heading: 'Something went wrong. Please attempt the upload again.',
          description: error.message
        });
      },
      async () => {
        setUiMessage({
          status: 'info',
          heading: 'Processing...',
          description:
            "We're preparing your document. This will take a few seconds. Please keep this window open."
        });

        const documentURL = await getDownloadURL(task.snapshot.ref);

        await processDocument({
          studentId: user._id,
          documentId: readableFileName,
          documentURL,
          title: readableFileName
        }).catch(async (e: any) => {
          return setUiMessage({
            status: 'error',
            heading: 'Something went wrong. Reload this page and try again.',
            description: e.message
          });
        });

        setUiMessage({
          status: 'success',
          heading: 'Done',
          description: 'Document has been uploaded.'
        });
      }
    );
  };

  const handleSelected = async (e) => {
    const { innerText, value } = e.target;
    if (value && innerText) {
      setDocumentURL(() => value);
      setDocumentName(() => innerText);
      setSelectedOption(innerText);
      setCanUpload(false);
      setConfirmReady(true);
    }
  };

  const handleFreshUpload = async (file, user, fileName) => {
    const readableFileName = fileName.toLowerCase().replace(/\s/g, '');

    if (!user?._id || !readableFileName) {
      return setUiMessage({
        status: 'error',
        heading: 'Something went wrong',
        description:
          "We couldn't retrieve your user details to start the upload process."
      });
    }
    const SIZE_IN_MB = parseInt((file?.size / 1_000_000).toFixed(2), 10);
    if (SIZE_IN_MB > MAX_FILE_UPLOAD_LIMIT) {
      setUiMessage({
        status: 'error',
        heading: 'Your file is too large',
        description: `Your file is ${SIZE_IN_MB}MB, above our ${MAX_FILE_UPLOAD_LIMIT}MB limit. Please upload a smaller document.`
      });
      return;
    }
    setProgress(5);
    const customFirestorePath = `${user._id}/${readableFileName}`;
    const storageRef = ref(storage, customFirestorePath);
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
          heading: 'Something went wrong. Please attempt the upload again.',
          description: error.message
        });
      },
      async () => {
        setUiMessage({
          status: 'info',
          heading: 'Processing...',
          description:
            "We're preparing your document. This will take a few seconds. Please keep this window open."
        });

        const documentURL = await getDownloadURL(task.snapshot.ref);

        const uploaded = await processDocument({
          studentId: user._id,
          documentId: readableFileName,
          documentURL,
          title: readableFileName
        }).catch(async (e: any) => {
          return setUiMessage({
            status: 'error',
            heading: 'Something went wrong. Reload this page and try again.',
            description: e.message
          });
        });

        const { documentURL: url, title } = uploaded.data[0];
        goToDocChat(url, title);
      }
    );
  };

  const goToDocChat = async (documentUrl, docTitle) => {
    navigate('/dashboard/docchat', {
      state: {
        documentUrl,
        docTitle
      }
    });
    setShowHelp(false);
    setShow(false);
  };

  const doNothing = () => {
    return;
  };

  const proceed = async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await goToDocChat(documentURL, documentName);
    } catch (error) {
      // Handle error
    } finally {
      setShow(false);
      setShowHelp(false);
    }
  };

  const ChatButton = () => {
    if (!chatButton) {
      return <></>;
    }
    if (canUpload) {
      return (
        <CustomButton
          type="button"
          onClick={collectFile}
          disabled={loading}
          title={loading ? 'Loading...' : 'Chat'}
          className="chat-btn"
        />
      );
    } else {
      return (
        <CustomButton
          type="button"
          active={confirmReady}
          onClick={confirmReady ? proceed : doNothing}
          title={loading ? 'Loading...' : 'Chat'}
          className="chat-btn"
        />
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
          {cancelButton && (
            <CustomButton
              type="button"
              isCancel
              onClick={handleClose}
              title="Cancel"
            />
          )}
          <ChatButton />
          {okayButton && (
            <CustomButton type="button" onClick={handleClose} title="Ok" />
          )}
        </div>
      }
    >
      <Wrapper>
        <div className="p-4" style={{ width: '100%' }}>
          {loadedStudentDocs && (
            <div style={{ width: '-webkit-fill-available' }}>
              <Label htmlFor="note">Select note</Label>
              <DocumentListWrapper>
                <CustomDropdown
                  value={selectedOption?.split('/').pop()}
                  placeholder="Select an Option"
                  className="drop-down-container"
                >
                  <VStack alignItems={'left'} padding="10px">
                    {loadedStudentDocs &&
                      studentDocuments.map((item, id) => {
                        return (
                          <option
                            value={item.documentURL}
                            key={id}
                            onClick={handleSelected}
                            style={{
                              cursor: 'pointer',
                              width: '100%'
                            }}
                          >
                            {item.title}
                          </option>
                        );
                      })}
                  </VStack>
                </CustomDropdown>
              </DocumentListWrapper>
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
            accept=".doc, .txt, .pdf"
            // accept="application/pdf"
            className="hidden"
            id="file-upload"
            ref={inputRef}
            onChange={collectFileInput}
          />
          <PDFTextContainer>
            <Text>
              Shepherd supports <Format>.doc, .txt, .pdf</Format> document
              formats.
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
