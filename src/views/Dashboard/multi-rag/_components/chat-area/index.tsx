import { useEffect, useState } from 'react';
import Message from './_components/message';
import ApiService from '../../../../../services/ApiService';

const ChatArea = ({ conversationID }: { conversationID: string }) => {
  const [fetchedDocuments, setFetchedDocuments] = useState<any[]>([]);

  useEffect(() => {
    ApiService.fetchMultiDocBasedOnConversationID(conversationID)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          console.log('fetchMultiDocBasedOnConversationID', data);
          ApiService.multiragChat({
            studentId: '64906166763aa2579e58c97d',
            query: 'Tell me about this document',
            language: 'English',
            conversationId: conversationID,
            documents: JSON.stringify(data.data)
          })
            .then((res) => res.json())
            .then((data) => {
              console.log('DOC chat response', data);
            });
        }
      });
  }, []);
  return (
    <div className="flex-[1.5] h-full space-y-2 pt-6 px-[3.25rem]">
      <Message
        type="bot"
        content="Welcome! I'm here to help you make the most of your time and notes. Ask me questions related to the documents added and I'll find answers that match.
Let's get learning!"
      />
      <Message type="user" content="What is relativity?" />
      <Message
        type="bot"
        content="In Physics, it is the dependence of various physical phenomena on relative motion of the observer and the observed objects, especially regarding the nature and behavior of light, space, time, and gravity."
      />
      <Message type="user" content="Explain this to me like I'm five " />
    </div>
  );
};

export default ChatArea;
