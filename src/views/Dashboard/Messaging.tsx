import userStore from '../../state/userStore';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import {
  Avatar,
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  ChannelPreviewMessenger,
  VirtualizedMessageList,
  MessageInput,
  Window,
  ScrollToBottomButton,
  Thread,
  useChatContext
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

  const CustomChannelPreviewMessenger = (props) => {
    const { channel, setActiveChannel } = props;

    return (
      <div
        className="custom-channel-preview"
        onClick={() => setActiveChannel(channel)}
      >
        <Avatar image={channel.data.image} size={40} />
        <div className="channel-info">
          <div className="channel-name">{channel.data.name}</div>
          <div className="last-message">
            {channel.data.last_message
              ? channel.data.last_message.text
              : 'No messages'}
          </div>
        </div>
      </div>
    );
  };

  const RenderChannel = () => {
    // Access the Chat context to get the active channel
    const { channel } = useChatContext();
    console.log('CHANNEL: ', channel);
    // If channel is frozen apply disabled channel styles
    return channel?.data?.frozen ? (
      <div className="stream-chat-frozen-wrapper">
        <Channel MessageNotification={ScrollToBottomButton}>
          <Window>
            <ChannelHeader />
            <VirtualizedMessageList
              additionalVirtuosoProps={{
                increaseViewportBy: { top: 400, bottom: 200 }
              }}
            />
            {/* <MessageInput /> */}
            <div className="stream-disabled-message">
              This chat has been disabled because your contract with this tutor
              has ended.
            </div>
          </Window>
          <Thread />
        </Channel>
      </div>
    ) : (
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
    );
  };

  return (
    <div className="stream-chat-wrapper">
      {isConnected && (
        <Chat client={client}>
          <ChannelList
            filters={{ members: { $in: [userRoleId] } }}
            sort={{ last_message_at: -1 }}
            additionalChannelSearchProps={{
              clearSearchOnClickOutside: true,
              popupResults: true,
              searchForChannels: true
            }}
            showChannelSearch
            // Preview={(props) => (
            //   <CustomChannelPreviewMessenger
            //     {...props}
            //     className="channel-preview"
            //   />
            // )}
            Preview={(props) => (
              <ChannelPreviewMessenger {...props} className="channel-preview" />
            )}
          />
          <RenderChannel />
        </Chat>
      )}
    </div>
  );
}
