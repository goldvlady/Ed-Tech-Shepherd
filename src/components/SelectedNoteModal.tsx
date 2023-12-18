import CustomToast from '../components/CustomComponents/CustomToast';
import { storage } from '../firebase';
import {
  MAX_FILE_UPLOAD_LIMIT,
  MAX_FILE_NAME_LENGTH
} from '../helpers/constants';
import { snip } from '../helpers/file.helpers';
import { processDocument } from '../services/AI';
import ApiService from '../services/ApiService';
import userStore from '../state/userStore';
import AutocompleteDropdown from './AutocompleteDropdown';
import CustomButton from './CustomComponents/CustomButton';
import CustomModal from './CustomComponents/CustomModal/index';
import { UploadIcon } from './icons';
import { AttachmentIcon } from '@chakra-ui/icons';
import {
  useToast,
  Center,
  Box,
  Text,
  CircularProgress,
  Flex
} from '@chakra-ui/react';
import {
  CircularProgress as CircularProgressBar,
  CircularProgressLabel,
  Progress
} from '@chakra-ui/react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import React, { useRef, useState, useEffect, RefObject } from 'react';
import { RiUploadCloud2Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const DocumentListWrapper = styled.div`
  max-height: 200px;
  background-color: 'green';
`;

// const Text = styled.p`
//   font-size: 0.8rem;
//   text-align: left;
//   line-height: 1.5;
//   color: var(--gray-600);
// `;
interface ShowProps {
  show: boolean;
  setShow: (show: boolean) => void;
  setShowHelp?: (showHelp: boolean) => void;
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
  const { user, userDocuments, fetchUserDocuments } = userStore();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('');
  const [countdown, setCountdown] = useState({
    active: false,
    message: ''
  });
  const [progress, setProgress] = useState(0);
  const [uiMessage, setUiMessage] = useState<UiMessage | null>(null);
  const [alreadyExist, setAlreadyExist] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [canUpload, setCanUpload] = useState(true);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [confirmReady, setConfirmReady] = useState(false);
  const [loadedStudentDocs, setLoadedStudentDocs] = useState(false);
  const inputRef = useRef(null) as RefObject<HTMLInputElement>;
  const [studentDocuments, setStudentDocuments] = useState<Array<any>>([]);
  const [documentURL, setDocumentURL] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [docKeywords, setDocKeywords] = useState([]);
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
    margin-top: 0.5rem;
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

  const Format = styled.span`
    font-weight: bold;
    color: var(--secondaryGray);
  `;
  const ErrorDiv = styled.div`
    height: auto;
    border-radius: 8px;
    background: red;
    width: auto;
    color: white;
    text-align: center;
    line-height: 40px;
    padding: 10px; /* Add some padding to the div */

    /* Style the header */
    p:first-child {
      font-size: 0.875rem;
      font-weight: bold;
    }

    /* Style the message */
    p:last-child {
      font-size: 0.75rem;
      line-height: 2;
    }
  `;

  const toast = useToast();

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

  const CountdownProgressBar = ({
    confirmReady,
    countdown
  }: {
    confirmReady: boolean;
    countdown: { active: boolean; message: string };
  }) => {
    // const [progress, setProgress] = useState(0);

    const randomSeed = (min = 1, max = 10) =>
      Math.floor(Math.random() * (max - min + 5) + min);

    useEffect(() => {
      if (confirmReady) {
        setProgress(() => 500);
      } else {
        const interval = setInterval(() => {
          setProgress((prevProgress) => prevProgress + randomSeed());
        }, 1000);

        return () => clearInterval(interval);
      }
    }, [confirmReady]);

    return (
      <div>
        <Progress
          size="lg"
          hasStripe
          value={progress}
          max={500}
          colorScheme="green"
        />
        {/* <CircularProgress
          value={progress}
          size="50px"
          thickness="4px"
          color="#207df7"
          max={500}
        /> */}
        <Text>{countdown.message}</Text>
      </div>
    );
  };

  const handleInputFreshUpload = async (file, user, fileName) => {
    setProgress(0);
    setCountdown(() => ({
      active: false,
      message: ''
    }));
    let readableFileName = fileName
      .toLowerCase()
      .replace(/\.pdf$/, '')
      .replace(/_/g, ' ');
    console.log(readableFileName.length);

    if (readableFileName.length > MAX_FILE_NAME_LENGTH) {
      readableFileName = readableFileName.substring(0, MAX_FILE_NAME_LENGTH);
      setCountdown((prev) => ({
        active: true,
        message: `The file name has been truncated to ${MAX_FILE_NAME_LENGTH} characters`
      }));
      setProgress(5);
    }
    if (!user?._id || !readableFileName) {
      return toast({
        render: () => (
          <CustomToast
            title="We couldn't retrieve your user details to start the upload process."
            status="error"
          />
        ),
        position: 'top-right',
        isClosable: true
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

    setCountdown(() => ({
      active: true,
      message: 'Uploading...your document is being uploaded'
    }));
    setProgress(25);
    const customFirestorePath = `${user._id}/${readableFileName}`;
    const storageRef = ref(storage, customFirestorePath);

    const task = uploadBytesResumable(storageRef, file);

    task.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 10
        );
        switch (snapshot.state) {
          case 'running':
            setProgress(progress);
            break;
        }
      },
      (error) => {
        setCountdown((prev) => ({
          active: false,
          message: 'Something went wrong. Please attempt the upload again.'
        }));
        setUploadFailed(true);
      },
      async () => {
        const documentURL = await getDownloadURL(task.snapshot.ref);
        setCountdown((prev) => ({
          ...prev,
          message:
            'Processing...this may take a minute (larger documents may take longer)'
        }));

        await processDocument({
          studentId: user._id,
          documentId: readableFileName,
          documentURL,
          title: readableFileName
        })
          .then((results) => {
            const { documentURL, title, documentId, keywords } =
              results.data[0];
            setConfirmReady(true);
            setCountdown((prev) => ({
              ...prev,
              message:
                "Your uploaded document is now ready! Click the 'chat' button to start."
            }));
            setDocumentId(() => documentId);
            setDocumentName(() => title);
            setDocumentURL(() => documentURL);
            setDocKeywords(() => keywords);
            setLoading(false);

            ApiService.saveStudentDocument({
              documentUrl: documentURL,
              title,
              ingestId: documentId
            });
          })
          .catch(async (e: any) => {
            setCountdown((prev) => ({
              ...prev,
              message: 'Something went wrong. Reload this page and try again.'
            }));
          });

        setConfirmReady(true);
      }
    );
  };

  function doesTitleExist(title: string) {
    const readableFileName = title
      .toLowerCase()
      .replace(/\.pdf$/, '')
      .replace(/_/g, ' ');

    // Check if the modified title exists in the array
    const exists = studentDocuments.some(
      (item) => item.title === readableFileName
    );

    return exists;
  }

  const collectFileInput = async (e) => {
    const inputFile = e.target.files[0];
    const fileChecked = doesTitleExist(inputFile?.name);
    setProgress(0);
    setConfirmReady(false);

    if (fileChecked) {
      setAlreadyExist(true);
    } else {
      setAlreadyExist(false);
      setLoading(true);
      try {
        setFileName(snip(inputFile.name));
        await handleInputFreshUpload(inputFile, user, inputFile.name);
      } catch (error) {
        // Handle errors
      }
    }
  };

  const handleSelected = async (e) => {
    setAlreadyExist(false);
    setUploadFailed(false);
    if (e.value && e.label && e.id) {
      setDocumentURL(() => e.value);
      setDocumentName(() => e.label);
      setDocumentId(() => e.id);
      setDocKeywords(() => e.keywords);
      setSelectedOption(e.label);
      setCanUpload(false);
      setConfirmReady(true);
    }
  };

  const goToDocChat = async (
    documentUrl,
    docTitle,
    documentId,
    docKeywords
  ) => {
    navigate('/dashboard/docchat', {
      state: {
        documentUrl,
        docTitle,
        documentId,
        docKeywords
      }
    });
    if (setShowHelp) {
      setShowHelp(false);
    }

    setShow(false);
    user && fetchUserDocuments(user._id);
  };

  const doNothing = () => {
    return;
  };

  const proceed = async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await goToDocChat(documentURL, documentName, documentId, docKeywords);
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
    return (
      <CustomButton
        type="button"
        active={confirmReady}
        onClick={confirmReady ? proceed : doNothing}
        title={loading ? 'Loading' : 'Chat'}
      />
    );
  };

  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files[0];
    // Handle dropped files here

    const fileChecked = doesTitleExist(files?.name);

    if (fileChecked) {
      setAlreadyExist(true);
    } else {
      setAlreadyExist(false);
      setLoading(true);
      try {
        setFileName(snip(files.name));
        await handleInputFreshUpload(files, user, files.name);
      } catch (error) {
        // Handle errors
      }
    }

    console.log(files, 'THIS NA FILE');
  };

  return (
    <CustomModal
      isOpen={show}
      onClose={handleClose}
      modalTitle="Upload or Select a Document"
      style={{
        maxWidth: '400px',
        height: 'auto'
      }}
      modalTitleStyle={{
        textAlign: 'left',
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
              <Text>
                To proceed, please upload a document or select from the existing
                list
              </Text>
              <Center
                w="full"
                minH="65px"
                mt={3}
                p={2}
                border="2px"
                borderColor={isDragOver ? 'gray.600' : 'gray.300'}
                borderStyle="dashed"
                rounded="lg"
                cursor="pointer"
                bg={isDragOver ? 'gray.600' : 'gray.50'}
                color={isDragOver ? 'white' : 'inherit'}
                onDragOver={(e) => handleDragEnter(e)}
                onDragEnter={(e) => handleDragEnter(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDrop={(e) => handleDrop(e)}
                onClick={clickInput}
              >
                <Box>
                  {fileName ? (
                    <Flex>
                      <AttachmentIcon /> <FileName>{fileName}</FileName>
                    </Flex>
                  ) : (
                    <Box>
                      <Center>
                        <RiUploadCloud2Fill
                          className="h-8 w-8"
                          color="gray.500"
                        />
                      </Center>

                      <Text
                        mb="2"
                        fontSize="sm"
                        color={isDragOver ? 'white' : 'gray.500'}
                        fontWeight="semibold"
                      >
                        Click to upload or drag and drop
                      </Text>
                      <PDFTextContainer>
                        <Text
                          fontSize="xs"
                          color={isDragOver ? 'white' : 'gray.500'}
                        >
                          DOC, TXT, or PDF (MAX. 500mb)
                        </Text>
                      </PDFTextContainer>
                    </Box>
                  )}
                </Box>

                <input
                  type="file"
                  accept=".doc, .txt, .pdf"
                  // accept="application/pdf"
                  className="hidden"
                  id="file-upload"
                  ref={inputRef}
                  onChange={collectFileInput}
                />
              </Center>
              <Center my={3}>Or</Center>
              {/* <Label htmlFor="note">Select note</Label> */}
              <DocumentListWrapper>
                <AutocompleteDropdown
                  studentDocuments={studentDocuments}
                  placeholder="Select a Document"
                  selectedOption={selectedOption}
                  handleSelected={handleSelected}
                ></AutocompleteDropdown>
              </DocumentListWrapper>
              {/* <OrText>Or</OrText> */}
            </div>
          )}
          <Box my={2}>
            {countdown.active && (
              <CountdownProgressBar
                confirmReady={confirmReady}
                countdown={countdown}
              />
            )}
          </Box>
          {alreadyExist && (
            <ErrorDiv className="py-1">
              <p>File Already Exists!</p>
              <p>
                The document you're trying to upload already exists. Please
                choose a different document or consider renaming it to avoid
                duplicates.
              </p>
            </ErrorDiv>
          )}
          {uploadFailed && (
            <ErrorDiv className="py-1">
              <p>Upload Failed!</p>
              <p>Something went wrong. Please attempt the upload again.</p>
            </ErrorDiv>
          )}
        </div>
      </Wrapper>
    </CustomModal>
  );
};

export default SelectedModal;
