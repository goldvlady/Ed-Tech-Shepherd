import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Message from './_components/message';
import ApiService from '../../../../../services/ApiService';
import { useQuery } from '@tanstack/react-query';
import { User, multiragResponse } from '../../../../../types';
import { ChatMessage } from '../../../home-work-help-2/_components/ai-bot-window/hooks/useChatManager';
import { Ore } from '@glamboyosa/ore';
import { encodeQueryParams } from '../../../../../helpers';
import { useVectorsStore } from '../../../../../state/vectorsStore';
import MessageArea from './_components/message-area';
import SuggestionArea from './_components/suggestion-area';
import InputArea from './_components/input-area';
import { doFetch } from '../../../../../util';
import { ChatScrollAnchor } from './_components/track-visibility';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../../../../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../../components/ui/select';
import { Button } from '../../../../../components/ui/button';
const firstKeyword = 'start of metadata';
const lastKeyword = 'end of metadata';
interface DocumentMetadata {
  page_label: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
}

interface VectorsMetadata {
  node_id: string;
  text: string;
  score: number;
  metadata: DocumentMetadata;
  chat: string;
}

const ChatArea = ({
  conversationID,
  studentId,
  userSelectedText,
  user,
  multipleSelectedDocs
}: {
  conversationID: string;
  studentId: string;
  user: User;
  multipleSelectedDocs: any[];
  userSelectedText: {
    purpose: 'summary' | 'explain' | 'translate' | null;
    text: string;
  };
}) => {
  const [vectorsMetadata, setVectorsMetadata] = useState<
    Array<VectorsMetadata[]>
  >([]);
  const [userMessage, setUserMessage] = useState('');
  const [streamEnded, setStreamEnded] = useState(true);
  const [fullBuffer, setFullBuffer] = useState('');
  const [currentChat, setCurrentChat] = useState('');
  const documents = useVectorsStore((state) => state.chatDocuments);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['conversationHistory', conversationID],

    queryFn: async () => {
      const r: multiragResponse<Array<ChatMessage>> =
        await ApiService.fetchMultiragConvoHistory(conversationID).then((res) =>
          res.json()
        );
      return r;
    }
  });
  const { data: vectorMD } = useQuery({
    queryKey: ['metadata', conversationID],

    queryFn: async () => {
      const r: multiragResponse<Array<VectorsMetadata[]>> =
        await ApiService.fetchMultiragMetadata(conversationID).then((res) =>
          res.json()
        );
      return r;
    }
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTranslateDialogOpen, setIsTranslateDialogOpen] = useState(false);
  console.log('data is', data);
  console.log(conversationID);
  useEffect(() => {
    if (data) {
      setCurrentChat('');
      setMessages(data.data);
    }
  }, [data]);
  useEffect(() => {
    if (vectorMD) {
      console.log('VECTORMD', vectorMD.data);
      setVectorsMetadata(vectorMD.data);
    }
  }, [vectorMD]);
  useEffect(() => {
    if (streamEnded && fullBuffer.length > 0) {
      const regex = new RegExp(firstKeyword + '(.*?)' + lastKeyword, 's');
      const match = fullBuffer.match(regex);
      const index = 1;
      if (match.length >= 0 && index < match.length) {
        const extractedContent = fullBuffer.match(regex)[1];
        console.log(fullBuffer.match);
        console.log('EXTRACTED CONTENT', extractedContent);

        console.log(extractedContent.split('\n').filter((el) => el.length > 0));
        console.log(
          extractedContent
            .split('\n')
            .filter((el) => el.length > 0)
            .map((el) => JSON.parse(el))
        );
        doFetch(
          `${ApiService.multiRagMainURL}/misc/set-metadata`,
          {
            method: 'POST',
            body: JSON.stringify({
              citation: JSON.stringify(
                extractedContent
                  .split('\n')
                  .filter((el) => el.length > 0)
                  .map((el) => JSON.parse(el))
                  .map((el) => ({ ...el, chat: currentChat }))
              ),
              conversationId: conversationID
            })
          },
          true,
          {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        ).then((resp) => resp.json());
        const vmd = vectorsMetadata;
        vmd.push(
          extractedContent
            .split('\n')
            .filter((el) => el.length > 0)
            .map((el) => JSON.parse(el))
            .map((el) => ({ ...el, chat: currentChat }))
        );
        setVectorsMetadata(vmd);
        setFullBuffer('');
        console.log('FB inside useEffect', fullBuffer);
      }

      refetch();
    }
  }, [streamEnded, fullBuffer, vectorsMetadata]);
  console.log('FULL BUFFER', fullBuffer);
  console.log('vmd', vectorsMetadata);
  // const currentChatRender = useMemo(() => {
  //   // This useCallback will return the ChatMessage component or null based on currentChat's value
  //   // It ensures that the component is only re-rendered when currentChat changes
  //   console.log('current chat is', currentChat);

  //   if (currentChat.length === 0) {
  //     console.log(currentChat, 'should be empty');
  //     return ''; // Don't render anything if there's no current chat content
  //   }

  //   return (
  //     <Message
  //       clickable
  //       metadata={[]}
  //       key={Math.random()}
  //       content={currentChat}
  //       type={'bot'}
  //       disableAnimation
  //     />
  //   );
  // }, [currentChat]);

  useEffect(() => {
    if (userSelectedText.text && userSelectedText.purpose) {
      let message = '';
      switch (userSelectedText.purpose) {
        case 'explain':
          message = 'Explain: ' + userSelectedText.text;
          setUserMessage(message);
          setTimeout(() => {
            submitMessageHandler(message);
          }, 500);
          break;
        case 'summary':
          message = 'Summarize: ' + userSelectedText.text;
          setUserMessage(message);
          setTimeout(() => {
            submitMessageHandler(message);
          }, 500);
          break;
        case 'translate':
          // message = 'Translate: ' + userSelectedText.text;
          handleTranslateDialogToggle(true);
          // setUserMessage(message);
          break;
      }
    }
  }, [userSelectedText.text, userSelectedText.purpose]);

  const handleTranslateDialogToggle = (value) => {
    setIsTranslateDialogOpen(value);
  };

  const handleLanguageSelect = (language) => {
    const message = `Translate to ${language}: ${userSelectedText.text}`;
    setUserMessage(message);
    handleTranslateDialogToggle(false);
    setTimeout(() => {
      submitMessageHandler(message);
    }, 500);
  };

  const submitMessageHandler = (selectedText?: string) => {
    const newMsg = {
      id: Date.now(), // Simplified ID generation, should be unique in a real application
      studentId: studentId, // Placeholder, replace with dynamic student ID
      log: {
        role: 'user',
        content: selectedText ? selectedText : userMessage
      },
      liked: false,
      disliked: false,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationId: conversationID //
    } as ChatMessage;
    setMessages((prev) => prev.concat(newMsg));
    setStreamEnded(false);
    const m = [...messages];
    const docs = documents.map((doc) => ({
      collection_name: doc.collection_name,
      reference: doc.reference
    }));
    const body = {
      studentId,
      query: selectedText ? selectedText : userMessage,
      language: 'English',
      conversationId: conversationID,
      documents: JSON.stringify(docs),
      fetchMetadata: 'True',
      history:
        m.length >= 4
          ? JSON.stringify(
              m.slice(-4).map((m) => `${m.log.role}: ${m.log.content}`)
            )
          : JSON.stringify(m.map((m) => `${m.log.role}: ${m.log.content}`))
    };

    // setUserMessage('');

    const q = encodeQueryParams(body);
    console.log('the query', q);
    setUserMessage('');
    const ore = new Ore({
      url: `${process.env.REACT_APP_AI_II}/multirag/chat${q}`,
      headers: {
        'X-Shepherd-Header': process.env.REACT_APP_AI_HEADER_KEY
      }
    });
    ore.fetchSSE((buffer) => {
      console.log(buffer);

      console.log('[Veerbal] - 2 fetch SSE');

      setFullBuffer(buffer);
      if (buffer.includes('done with stream')) {
        setStreamEnded(true);
        console.log('[Veerbal] - 3 done with stream');
      }
      if (buffer.includes(firstKeyword)) {
        return;
      }
      if (buffer.includes('run out of credits')) {
        // here eventually we will implement running out of credits like AI tutor
        //setOpenPricingModel(true);
        setStreamEnded(true);
        console.log('[Veerbal] - 3 done with stream');
        return;
      }
      setCurrentChat(buffer);
    });
  };

  console.log('JUST A LOG', currentChat, !streamEnded);
  return (
    <div className="flex-[1.5] h-full space-y-2 pt-6 px-[3.25rem] flex flex-col no-scrollbar pr-0">
      <MessageArea>
        <AnimatePresence mode="wait">
          {isLoading && (
            <>
              {Array.from({ length: 8 }).map((_, index) => (
                <Message
                  key={index}
                  clickable
                  metadata={[]}
                  type={index % 2 === 0 ? 'bot' : 'user'}
                  loading
                  content=""
                  disableAnimation={true}
                />
              ))}
            </>
          )}
          {messages?.length > 0 && (
            <>
              {messages
                .sort((a, b) => a.id - b.id)
                .map((msg) => (
                  <Message
                    key={msg.id}
                    metadata={msg.log.role === 'user' ? [] : vectorsMetadata}
                    id={msg.id}
                    type={msg.log.role === 'user' ? 'user' : 'bot'}
                    content={msg.log.content}
                    isPinned={msg.isPinned}
                    isLiked={msg.liked}
                    clickable={!!user}
                    disableAnimation={true}
                  />
                ))}
            </>
          )}
          {currentChat.length > 0 && (
            <Message
              clickable
              metadata={[]}
              content={currentChat}
              type="bot"
              disableAnimation={true}
            />
          )}
          {!streamEnded && currentChat.length === 0 && (
            <Message
              type="bot"
              content=""
              metadata={[]}
              clickable
              bubble
              disableAnimation={true}
            />
          )}
        </AnimatePresence>
      </MessageArea>
      <div className="w-full pb-[3.5rem] relative">
        <SuggestionArea
          setUserMessage={setUserMessage}
          submitHandler={submitMessageHandler}
        />
        <InputArea
          clickable={!!user}
          documents={documents}
          submitHandler={submitMessageHandler}
          value={userMessage}
          setValue={setUserMessage}
          multipleSelectedDocs={multipleSelectedDocs}
        />
      </div>
      <TranslationDialog
        open={isTranslateDialogOpen}
        onClose={handleTranslateDialogToggle}
        onSelectLanguage={handleLanguageSelect}
      />
    </div>
  );
};

const TranslationDialog = ({ open, onClose, onSelectLanguage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleChange = (value) => {
    setSelectedLanguage(value);
  };

  const handleSelect = () => {
    onSelectLanguage(selectedLanguage);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Translate</DialogTitle>
        </DialogHeader>
        <Select value={selectedLanguage} onValueChange={handleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="German">German</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button
            onClick={() => {
              onClose(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedLanguage}>
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatArea;
