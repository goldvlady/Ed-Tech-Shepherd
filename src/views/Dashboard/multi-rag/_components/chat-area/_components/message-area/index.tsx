const MessageArea = ({ children }) => (
  <div className="messages-area flex-1 overflow-scroll pb-32 no-scrollbar space-y-4">
    {children}
  </div>
);

export default MessageArea;
