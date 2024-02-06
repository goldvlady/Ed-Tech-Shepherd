import { Input } from '@chakra-ui/input';

function ChatInput() {
  return (
    <div className="w-full border rounded-sm shadow-sm flex gap-2 items-center">
      <Input size="md" placeholder="Ask me anything?" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded-sm">
        Send
      </button>
    </div>
  );
}

export default ChatInput;
