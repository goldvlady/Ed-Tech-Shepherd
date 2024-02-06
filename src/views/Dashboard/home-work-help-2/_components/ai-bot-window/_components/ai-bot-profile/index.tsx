import { Avatar } from '@chakra-ui/avatar';

const AIBotProfile = () => {
  return (
    <div className="w-full p-4 bg-sky-200 rounded-md">
      <div className="flex gap-3">
        <Avatar name="Veerbal" src="https://bit.ly/dan-abramov" />
        <div className="flex flex-col gap-1">
          <h4 className="text-stone-800">Veerbal Singh</h4>
          <p className="text-sm">
            I am your AI Tutor. I am here to help you with your homework.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIBotProfile;
