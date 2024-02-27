import Input from './_components/input';
import { useState } from 'react';
import WelcomeBackText from './_components/welcome-text';
import RecentConversations from './_components/recent-conversations';

function InteractiveArea({
  initiateConversation
}: {
  initiateConversation: ({
    subject,
    topic,
    level
  }: {
    subject: string;
    topic: string;
    level: string;
  }) => void;
}) {
  const [chatContext, setChatContext] = useState({
    subject: '',
    topic: '',
    level: ''
  });

  const handleSubjectChange = (subject: string) => {
    setChatContext((prev) => ({ ...prev, subject }));
  };

  const handleTopicChange = (topic: string) => {
    setChatContext((prev) => ({ ...prev, topic }));
  };

  const handleLevelChange = (level: string) => {
    setChatContext((prev) => ({ ...prev, level }));
  };

  const handleSubmit = () => {
    initiateConversation(chatContext);
  };

  return (
    <div className="w-[80%] mx-auto max-w-[600px] mb-24 relative">
      <WelcomeBackText />
      <Input
        actions={{
          handleSubjectChange,
          handleTopicChange,
          onSubmit: handleSubmit,
          handleLevelChange
        }}
        state={{ chatContext }}
      />
      <RecentConversations />
    </div>
  );
}

export default InteractiveArea;
