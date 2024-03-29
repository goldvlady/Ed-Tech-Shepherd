import Input from './_components/input';
import { useState } from 'react';
import WelcomeBackText from './_components/welcome-text';
import RecentConversations from './_components/recent-conversations';
import { languages } from '../../../../../../../../helpers';
import { MathModeInfoTip } from './_components/input/mathmode';
type Language = (typeof languages)[number] | '';
function InteractiveArea({
  initiateConversation
}: {
  initiateConversation: ({
    subject,
    topic,
    level,
    language
  }: {
    subject: string;
    topic: string;
    level: string;
    language: Language;
  }) => void;
}) {
  const [chatContext, setChatContext] = useState<{
    subject: string;
    topic: string;
    level: string;
    language: Language;
  }>({
    subject: '',
    topic: '',
    level: '',
    language: ''
  });

  const [showMathModeInfo, setShowMathModeInfo] = useState(false);

  const handleSubjectChange = (subject: string) => {
    setChatContext((prev) => ({ ...prev, subject }));
  };

  const handleTopicChange = (topic: string) => {
    setChatContext((prev) => ({ ...prev, topic }));
  };

  const handleLevelChange = (level: string) => {
    setChatContext((prev) => ({ ...prev, level }));
  };
  const handleLanguageChange = (language: Language) => {
    setChatContext((prev) => ({ ...prev, language }));
  };

  const handleSubmit = () => {
    setShowMathModeInfo(false);
    initiateConversation(chatContext);
  };

  return (
    <div className="w-[80%] mx-auto max-w-[600px] mb-24 relative">
      <div className="relative">
        {showMathModeInfo && (
          <div className=" absolute top-[-16rem] z-50">
            <MathModeInfoTip
              isOpen={showMathModeInfo}
              onClose={() => setShowMathModeInfo(false)}
            />
          </div>
        )}
      </div>

      <WelcomeBackText />
      <Input
        actions={{
          handleSubjectChange,
          handleTopicChange,
          onSubmit: handleSubmit,
          handleLevelChange,
          handleLanguageChange
        }}
        state={{ chatContext }}
        showMathModeInfo={showMathModeInfo}
        setShowMathModeInfo={setShowMathModeInfo}
      />
      <RecentConversations />
    </div>
  );
}

export default InteractiveArea;
