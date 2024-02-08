import Input from './_components/input';
import { useState } from 'react';
import WelcomeBackText from './_components/welcome-text';
import RecentConversations from './_components/recent-conversations';

function InteractiveArea() {
  const [chatContext, setChatContext] = useState({
    subject: '',
    topic: ''
  });

  const handleSubjectChange = (subject: string) => {
    setChatContext((prev) => ({ ...prev, subject }));
  };

  const handleTopicChange = (topic: string) => {
    setChatContext((prev) => ({ ...prev, topic }));
  };

  const handleSubmit = () => {
    console.log('Submitted', chatContext);
  };

  return (
    <div className="w-[80%] mx-auto max-w-[600px] mb-24 relative">
      <WelcomeBackText />
      <Input
        actions={{
          handleSubjectChange,
          handleTopicChange,
          onSubmit: handleSubmit
        }}
        state={{ chatContext }}
      />
      <RecentConversations />
    </div>
  );
}

export default InteractiveArea;
