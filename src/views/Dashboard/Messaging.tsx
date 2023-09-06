import userStore from '../../state/userStore';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  ChannelPreviewMessenger,
  VirtualizedMessageList,
  MessageInput,
  Window,
  ScrollToBottomButton,
  Thread
} from 'stream-chat-react';

const client = new StreamChat(
  process.env.REACT_APP_STREAM_CHAT_API_KEY as string
);

export default function Messages() {
  const currentRoute = useLocation().pathname;
  const { user } = userStore();

  const userName = user?.name?.first ?? '';
  const avatar = user?.avatar ?? '';
  const [userRoleId, setUserRoleId] = useState('');
  const [userRoleToken, setUserRoleToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const setUserRoleInfo = (id, token) => {
    setUserRoleId(id);
    setUserRoleToken(token);
  };

  const disconnectAndReset = async () => {
    if (client.user) {
      await client.disconnectUser();
      setIsConnected(false);
      setUserRoleId('');
      setUserRoleToken('');
    }
  };

  useEffect(() => {
    if (user) {
      const userType = currentRoute.includes('tutordashboard')
        ? 'tutor'
        : 'student';
      const role = user[userType];
      const token = user.streamTokens?.find((token) => token.type === userType);
      setUserRoleInfo(role?._id, token?.token);
    }
    return () => {
      disconnectAndReset();
    };
  }, [user]);

  useEffect(() => {
    if (userRoleId && userRoleToken) {
      const connectUserToChat = async () => {
        await client.connectUser(
          {
            id: userRoleId,
            name: userName,
            image: avatar
          },
          userRoleToken
        );
        setIsConnected(true);
      };
      connectUserToChat();
    }
  }, [userRoleId, userRoleToken]);

  return (
    <div className="stream-chat-wrapper">
      {isConnected && (
        <Chat client={client}>
          <ChannelList
            filters={{ members: { $in: [userRoleId] } }}
            sort={{ last_message_at: -1 }}
            showChannelSearch
            Preview={ChannelPreviewMessenger}
            additionalChannelSearchProps={{
              clearSearchOnClickOutside: true,
              popupResults: true,
              searchForChannels: true
            }}
          />
          <Channel MessageNotification={ScrollToBottomButton}>
            <Window>
              <ChannelHeader />
              <VirtualizedMessageList
                additionalVirtuosoProps={{
                  increaseViewportBy: { top: 400, bottom: 200 }
                }}
              />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      )}
    </div>
  );
}
