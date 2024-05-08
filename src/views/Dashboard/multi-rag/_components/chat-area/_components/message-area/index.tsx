const MessageArea = ({ children }) => (
  <div className="messages-area flex-1 overflow-scroll pb-32 no-scrollbar">
    {children}
  </div>
);

export default MessageArea;
