import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DocsThumbnailList from '../_components/docs-thumbnail-list';
import ChatArea from '../_components/chat-area';
import LearningResourcesSection from '../_components/learning-resources-section';
import PDFViewer from '../_components/pdf-viewer';
import { useEffect, useState } from 'react';
import useUserStore from '../../../../state/userStore';
import { Sheet, SheetTrigger } from '../../../../components/ui/sheet';
import { Button } from '../../../../components/ui/button';
import PlansModal from '../../../../components/PlansModal';
import { MultiragDocument } from '../../../../types';
import { useMutation } from '@tanstack/react-query';
import ApiService from '../../../../services/ApiService';
import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';

function MultiRagChat() {
  const { docId } = useParams();
  const { user } = useUserStore();
  const [selectedDocumentID, setSelectedDocumentID] = useState({
    id: '',
    name: ''
  });
  const [filesUploading, setFilesUploading] = useState<{
    jobId: string;
    uploading: 'uploading' | 'success' | 'default' | 'error';
    tables: Array<string>;
  }>({
    jobId: '',
    uploading: 'default',
    tables: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const apiKey = searchParams.get('apiKey');

  const [userSelectedText, setUserSelected] = useState<{
    purpose: 'summary' | 'explain' | 'translate' | null;
    text: string;
  }>({
    purpose: null,
    text: ''
  });
  const navigate = useNavigate();
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const { mutateAsync } = useMutation({
    mutationKey: ['add-doc'],
    mutationFn: async (d: {
      documentIds: Array<string>;
      conversationId: string;
    }) => {
      const data = await ApiService.multiAddDoc(d).then((resp) => resp.json());
      return data;
    }
  });
  const toast = useCustomToast();
  const { mutate } = useMutation({
    mutationKey: ['long-poll'],
    mutationFn: async (d: { jobId: string; tables: Array<string> }) => {
      const data: {
        vectors?: Array<MultiragDocument>;
        status: 'error' | 'in_progress' | 'success';
      } = await ApiService.multiDocBackgroundJobs(d).then((resp) =>
        resp.json()
      );
      return data;
    },
    async onSuccess(data) {
      console.log('success', data);
      try {
        if (data.status === 'in_progress') {
          mutate({
            jobId: filesUploading.jobId,
            tables: filesUploading.tables
          });
        } else if (data.status === 'success') {
          const documentIds = data.vectors.map((v) => v.document_id);
          await mutateAsync({ documentIds, conversationId: docId });
          setFilesUploading({ uploading: 'success', tables: [], jobId: '' });
          setIsLoading(false);
          toast({
            position: 'top-right',
            title: `Documents Added to Conversation Successfully`,
            status: 'success'
          });
        } else {
          // if it fails i don't wanna indefinitely keep uploading
          toast({
            position: 'top-right',
            title: `Documents Upload Failed. Please retry.`,
            status: 'error'
          });
          setIsLoading(false);
          setFilesUploading({ uploading: 'error', tables: [], jobId: '' });
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setFilesUploading({ uploading: 'error', tables: [], jobId: '' });
        toast({
          position: 'top-right',
          title: `Documents Upload Failed. Please retry.`,
          status: 'error'
        });
      }
    }
  });
  useEffect(() => {
    if (
      filesUploading.jobId.length > 0 &&
      filesUploading.tables.length > 0 &&
      filesUploading.uploading === 'uploading'
    ) {
      mutate({ jobId: filesUploading.jobId, tables: filesUploading.tables });
      setFilesUploading({ ...filesUploading, uploading: 'default' });
      setIsLoading(true);
    }
  }, [filesUploading]);
  useEffect(() => {
    if (!user && !apiKey) {
      navigate('/signup');
    }
    if (apiKey) {
      const inputElements = document.querySelectorAll('textarea');

      // Disable each input element on the page
      inputElements.forEach((input) => {
        input.disabled = true;
      });
      window.addEventListener('click', () => {
        setTogglePlansModal(true);
      });
    }
  }, [user, apiKey, navigate]);
  const [highlightedDocumentPageIndex, setHighlightedDocumentPageIndex] =
    useState(0);

  const getTextForSummary = (text: string) => {
    setUserSelected({
      purpose: 'summary',
      text
    });
  };

  const getTextForExplaination = (text: string) => {
    setUserSelected({
      purpose: 'explain',
      text
    });
  };
  const getTextForTranslation = (text: string) => {
    setUserSelected({
      purpose: 'translate',
      text
    });
  };

  return (
    <div className="bg-[#F9F9FB] w-full h-full overflow-hidden flex relative">
      <DocsThumbnailList
        user={user}
        isUploading={
          filesUploading.uploading === 'uploading' ? true : isLoading
        }
        setFilesUploading={setFilesUploading}
        conversationID={docId}
        setSelectedDocumentID={setSelectedDocumentID}
        selectedDocumentID={selectedDocumentID}
      />
      <PDFViewer
        selectedDocumentID={selectedDocumentID}
        getTextForSummary={getTextForSummary}
        getTextForExplaination={getTextForExplaination}
        getTextForTranslation={getTextForTranslation}
        highlightedDocumentPageIndex={highlightedDocumentPageIndex}
      />
      <ChatArea
        conversationID={docId}
        studentId={user._id}
        userSelectedText={userSelectedText}
        user={user}
      />
      <LearningResourcesSection
        user={user}
        conversationID={docId}
        selectedDocumentID={selectedDocumentID.id}
        setHighlightedDocumentPageIndex={setHighlightedDocumentPageIndex}
      />
      {togglePlansModal && (
        <PlansModal
          togglePlansModal={togglePlansModal}
          setTogglePlansModal={setTogglePlansModal}
        />
      )}
    </div>
  );
}

export default MultiRagChat;
