import { Button } from '@chakra-ui/button';
import {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Close
} from '@radix-ui/react-dialog';
import BountyForm from './form';

function FindATutorButton() {
  return (
    <div>
      <Root>
        <Trigger asChild>
          <Button
            variant="outline"
            borderRadius="full"
            size="sm"
            style={{
              border: '1px solid #207DF7',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px',
              color: '#207DF7'
            }}
          >
            Find a tutor
          </Button>
        </Trigger>
        <Portal>
          <Overlay className="bg-white/10 backdrop-blur-sm data-[state=open]:animate-overlayShow fixed inset-0" />
          <Content className="flex flex-col data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[636px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <header className="h-[72px] border-b-2 p-5 pb-5 overflow-hidden w-full flex justify-between items-center">
              <p className="text-[#212224] font-semibold text-xl">
                Place Bounty
              </p>
              <Close>
                <button className="w-[60px] h-[20px] rounded-full bg-[#F3F5F6] text-[#969CA6] text-xs flex items-center justify-center">
                  Close &times;
                </button>
              </Close>
            </header>
            <div className="body w-full p-5 flex-1 bg-white">
              <BountyForm />
            </div>
          </Content>
        </Portal>
      </Root>
    </div>
  );
}

export default FindATutorButton;
