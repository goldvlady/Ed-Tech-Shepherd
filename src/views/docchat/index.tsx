import { checkDocumentStatus } from '../../services/AI';
import userStore from '../../state/userStore';
import TempPDFViewer from './TempPDFViewer';
import Chat from './chat';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NotReady = () => {
  return (
    <div className="bg-violet-600 text-white text-center p-4">
      <p>Give it a second...the AI is studying your document!</p>
    </div>
  );
};

export default function DocChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = userStore();

  useEffect(() => {
    if (!location.state?.documentUrl) navigate('/dashboard/notes');
  }, [navigate, location.state?.documentUrl]);

  return (
    location.state?.documentUrl && (
      <section className="divide-y max-w-screen-xl mx-auto">
        <div className="h-screen bg-white divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
          <TempPDFViewer pdfLink={location.state.documentUrl} />
          <Chat documentId={location.state.docTitle} studentId={user?._id} />
        </div>
      </section>
    )
  );
}
